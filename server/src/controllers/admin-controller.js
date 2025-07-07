const { User, Admin, Committee, CommitteeMember } = require("../models");
const db = require("../models"); // Add this line to import the db object
const bcrypt = require("bcrypt");
const {
  sendMail,
  buildUserWelcomeEmail,
  buildUserDeletionEmail,
  buildCommitteeAdditionEmail,
  buildCommitteeRemovalEmail,
  buildUserStatusUpdateEmail,
} = require("../utils/email-service");
const { generateRandomPassword } = require("../utils/password-utils");
const e = require("express");

// Helper to remove null fields from objects
function removeNullFields(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeNullFields);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== null)
        .map(([k, v]) => [k, removeNullFields(v)])
    );
  }
  return obj;
}

// Account Management Controllers
const adminController = {
  // 3.1.1, 3.1.2, 3.1.3 Create accounts for committee members, staff, chairs
  async createUser(req, res) {
    try {
      const { email, firstName, lastName, role, committeeId, userType } =
        req.body;

      // Remove super admin check for admin creation

      // Check if user with this email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }

      // Only check committee existence and insert into CommitteeMembers if committeeId is provided
      if ((role === "COMMITTEE_MEMBER" || role === "STAFF") && committeeId) {
        const committeeExists = await db.sequelize.query(
          `SELECT 1 FROM "Committees" WHERE committee_id = ${committeeId}`,
          { type: db.sequelize.QueryTypes.SELECT }
        );

        if (committeeExists.length === 0) {
          return res.status(400).json({
            error: `Committee with ID ${committeeId} does not exist. Please create the committee first.`,
          });
        }
      }

      // Find the maximum user_id and increment it
      const [maxIdResult] = await db.sequelize.query(
        'SELECT COALESCE(MAX(user_id), 0) + 1 as next_id FROM "Users"',
        { type: db.sequelize.QueryTypes.SELECT }
      );

      const nextId = maxIdResult.next_id;

      // Generate random password
      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create unique identity number
      const identityNumber =
        role.substring(0, 3).toUpperCase() + Date.now().toString().substring(7);

      // Create user with explicit user_id
      const user = await db.sequelize.query(
        `
      INSERT INTO "Users" (
        user_id, email, identity_number, first_name, last_name, 
        password, role, created_at, validity
      ) VALUES (
        ${nextId}, '${email}', '${identityNumber}', '${firstName}', '${lastName}', 
        '${hashedPassword}', '${role}', NOW(), false
      ) RETURNING user_id, email, role
    `,
        { type: db.sequelize.QueryTypes.INSERT }
      );

      const userId = nextId; // Use the calculated ID

      // Based on role, create appropriate records
      if (role === "ADMIN") {
        await db.sequelize.query(`
        INSERT INTO "Admins" (
          user_id, admin_type, created_at, updated_at
        ) VALUES (
          ${userId}, '${userType || "ERC_TECHNICAL"}', NOW(), NOW()
        )
      `);
      } else if (role === "COMMITTEE_MEMBER" || role === "STAFF") {
        // Only insert into CommitteeMembers if committeeId is provided
        if ((role === "COMMITTEE_MEMBER" || role === "STAFF") && committeeId) {
          await db.sequelize.query(`
          INSERT INTO "CommitteeMembers" (
            user_id, committee_id, role, created_at, updated_at
          ) VALUES (
            ${userId}, ${committeeId}, '${role === "COMMITTEE_MEMBER" ? "MEMBER" : "STAFF"}', 
            NOW(), NOW()
          )
        `);
        } else if (
          (role === "COMMITTEE_MEMBER" || role === "STAFF") &&
          !committeeId
        ) {
          // No committee assignment at creation; can be assigned later
          console.log(
            `User ${email} created as ${role} without committee assignment`
          );
        }
      }

      // Use the email utility to build personalized email content
      const { subject, html, text } =
        require("../utils/email-service").buildUserWelcomeEmail({
          firstName,
          lastName,
          email,
          password,
          role,
          committeeId,
        });

      await sendMail({
        to: email,
        subject,
        text,
        html,
      });

      console.log("Email sent to:", email);
      // Return success response
      console.log("=== User Created ===");
      console.log(user);
      console.log("====================");
      console.log("User ID:", userId);
      console.log("Password:", password);
      console.log("====================");

      return res.status(201).json({
        message: "User created successfully and credentials sent via email",
        userId: userId,
        password: password, // Include password in response for testing (remove in production)
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 3.1.3 list users
  async listUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: [
          "user_id",
          "email",
          "identity_number",
          "first_name",
          "last_name",
          "password",
          "role",
          "created_at",
          "validity",
        ],
        order: [["user_id", "ASC"]],
      });
      if (!users || users.length === 0) {
        return res.status(404).json({ error: "No users found" });
      }
      // Return the list of users
      console.log("=== Users ===");
      console.log(users);
      console.log("================");
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  // Make the Account Deletion function more generic
  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;

      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Send deletion notification email before deleting
      try {
        const { subject, html, text } = buildUserDeletionEmail({
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
        });

        await sendMail({
          to: user.email,
          subject,
          text,
          html,
        });

        console.log("Deletion notification email sent to:", user.email);
      } catch (emailError) {
        console.error(
          "Failed to send deletion notification email:",
          emailError
        );
        // Continue with deletion even if email fails
      }

      // If user is an admin, delete from Admins table first
      if (user.role === "ADMIN") {
        await Admin.destroy({ where: { user_id: userId } });
      }

      // Remove user from all committees before deleting user
      await CommitteeMember.destroy({ where: { user_id: userId } });

      // Delete the user
      await user.destroy();

      return res.status(200).json({
        message: "User deleted successfully",
        userId,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  async getTableStructure(req, res) {
    try {
      const { tableName } = req.params;

      if (!tableName) {
        return res.status(400).json({ error: "Table name is required" });
      }

      const columns = await db.sequelize.query(
        `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = '${tableName}'
      ORDER BY ordinal_position
    `,
        { type: db.sequelize.QueryTypes.SELECT }
      );

      return res.status(200).json({
        tableName,
        columns,
      });
    } catch (error) {
      console.error(
        `Error getting table structure for ${req.params.tableName}:`,
        error
      );
      return res.status(500).json({ error: error.message });
    }
  },

  async fixSequence(req, res) {
    try {
      // Find the maximum user_id
      const [maxIdResult] = await db.sequelize.query(
        'SELECT COALESCE(MAX(user_id), 0) + 1 as max_id FROM "Users"',
        { type: db.sequelize.QueryTypes.SELECT }
      );

      const maxId = maxIdResult.max_id;

      // Reset the sequence to the max_id
      await db.sequelize.query(
        `ALTER SEQUENCE "Users_user_id_seq" RESTART WITH ${maxId}`
      );

      return res.status(200).json({
        message: "User ID sequence has been reset",
        newSequenceValue: maxId,
      });
    } catch (error) {
      console.error("Error fixing sequence:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 3.1.4 List all reviewers under each committee
  async listCommitteeReviewers(req, res) {
    try {
      console.log("=== BACKEND: listCommitteeReviewers called ===");

      // First, let's check if the tables exist and their structure
      try {
        const committeesCheck = await db.sequelize.query(
          'SELECT COUNT(*) as count FROM "Committees"',
          { type: db.sequelize.QueryTypes.SELECT }
        );
        console.log("Committees table check:", committeesCheck);

        const membersCheck = await db.sequelize.query(
          'SELECT COUNT(*) as count FROM "CommitteeMembers"',
          { type: db.sequelize.QueryTypes.SELECT }
        );
        console.log("CommitteeMembers table check:", membersCheck);

        const usersCheck = await db.sequelize.query(
          'SELECT COUNT(*) as count FROM "Users"',
          { type: db.sequelize.QueryTypes.SELECT }
        );
        console.log("Users table check:", usersCheck);
      } catch (tableError) {
        console.error("Table check error:", tableError);
        return res
          .status(500)
          .json({ error: "Database table error: " + tableError.message });
      }

      // Get all committees first
      const committees = await db.sequelize.query(
        'SELECT committee_id, committee_name, committee_type FROM "Committees"',
        { type: db.sequelize.QueryTypes.SELECT }
      );
      console.log("All committees:", committees);

      // Get all committee members with user details
      const membersQuery = `
        SELECT 
          cm.member_id,
          cm.committee_id,
          cm.role as member_role,
          u.user_id,
          u.first_name,
          u.last_name,
          u.email,
          u.validity
        FROM "CommitteeMembers" cm
        INNER JOIN "Users" u ON cm.user_id = u.user_id
        ORDER BY cm.committee_id, cm.member_id
      `;

      const members = await db.sequelize.query(membersQuery, {
        type: db.sequelize.QueryTypes.SELECT,
      });
      console.log("All committee members:", members);

      // Group members by committee
      const membersByCommittee = {};
      members.forEach((member) => {
        if (!membersByCommittee[member.committee_id]) {
          membersByCommittee[member.committee_id] = [];
        }
        membersByCommittee[member.committee_id].push({
          member_id: member.member_id,
          role: member.member_role,
          user: {
            user_id: member.user_id,
            first_name: member.first_name,
            last_name: member.last_name,
            email: member.email,
            validity: member.validity,
          },
        });
      });

      // Combine committees with their members
      const result = committees.map((committee) => ({
        committee_id: committee.committee_id,
        committee_name: committee.committee_name,
        committee_type: committee.committee_type,
        members: membersByCommittee[committee.committee_id] || [],
      }));

      console.log(
        "Final result:",
        result.map((c) => ({
          committee_id: c.committee_id,
          committee_name: c.committee_name,
          member_count: c.members.length,
          members: c.members.map((m) => ({
            member_id: m.member_id,
            user_id: m.user.user_id,
            user_name: `${m.user.first_name} ${m.user.last_name}`,
          })),
        }))
      );

      console.log("=== END BACKEND DEBUG ===");

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error listing reviewers:", error);
      return res.status(500).json({ error: "Failed to list reviewers" });
    }
  },

  // 3.1.5 Block/Remove accounts
  async updateUserStatus(req, res) {
    try {
      const { userId, validity, reason } = req.body;

      console.log("updateUserStatus called with:", {
        userId,
        validity,
        reason,
      });

      // Check if user exists
      const userIdInt = parseInt(userId);
      console.log(
        "Looking for user with ID:",
        userIdInt,
        "Type:",
        typeof userIdInt
      );

      const user = await User.findByPk(userIdInt);
      if (!user) {
        console.log("User not found:", userIdInt);
        return res.status(404).json({ error: "User not found" });
      }

      console.log(
        "Found user:",
        user.user_id,
        user.email,
        "Current validity:",
        user.validity
      );
      console.log("Updating validity to:", validity);

      // Update user validity
      await user.update({ validity });

      // Send status update notification email
      try {
        const { subject, html, text } = buildUserStatusUpdateEmail({
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          newStatus: validity,
          reason: reason,
        });

        await sendMail({
          to: user.email,
          subject,
          text,
          html,
        });

        console.log("Status update notification sent to:", user.email);
      } catch (emailError) {
        console.error("Failed to send status update notification:", emailError);
        // Continue even if email fails
      }

      return res.status(200).json({
        message: "User status updated successfully",
        userId,
        validity,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // async updateDatabaseSchema(_, res) {
  //   try {
  //     //add columns applicant_category, first_name, last_name, email to Applicants table
  //     await db.sequelize.query(`
  //     ALTER TABLE "Applicants"
  //     ADD COLUMN IF NOT EXISTS applicant_category VARCHAR(255),
  //     ADD COLUMN IF NOT EXISTS first_name VARCHAR(255),
  //     ADD COLUMN IF NOT EXISTS last_name VARCHAR(255),
  //     ADD COLUMN IF NOT EXISTS email VARCHAR(255);
  //   `);

  //     //remove column user_id from Applicants table
  //     await db.sequelize.query(`
  //     ALTER TABLE "Applicants"
  //     DROP COLUMN IF EXISTS user_id;
  //   `);
  //   } catch (error) {
  //     console.error("Error updating database schema:", error);
  //     return res.status(500).json({ error: error.message });
  //   }
  // },

  async checkApplicationsTable(req, res) {
    try {
      // Check table structure
      const columns = await db.sequelize.query(
        `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Applications'
      ORDER BY ordinal_position;
    `,
        { type: db.sequelize.QueryTypes.SELECT }
      );

      // Count records
      const [countResult] = await db.sequelize.query(
        `
      SELECT COUNT(*) as count FROM "Applications";
    `,
        { type: db.sequelize.QueryTypes.SELECT }
      );

      return res.status(200).json({
        tableStructure: columns,
        recordCount: countResult.count,
      });
    } catch (error) {
      console.error("Error checking table structure:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  async checkApplicantTable(req, res) {
    try {
      // Check if table exists
      const tableCheck = await db.sequelize.query(
        `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'Applicants'
      );
    `,
        { type: db.sequelize.QueryTypes.SELECT }
      );

      if (!tableCheck[0].exists) {
        return res
          .status(404)
          .json({ error: "Applicants table does not exist" });
      }

      // Check columns
      const columns = await db.sequelize.query(
        `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Applicants'
      ORDER BY ordinal_position;
    `,
        { type: db.sequelize.QueryTypes.SELECT }
      );

      return res.status(200).json({
        tableExists: true,
        columns,
      });
    } catch (error) {
      console.error("Error checking Applicants table:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  async checkModels(req, res) {
    try {
      // Get all model names
      const models = Object.keys(db).filter(
        (key) => typeof db[key] === "function" && key !== "Sequelize"
      );

      //get all the associations of the models
      const applicationAssociations = [];
      if (db.Application && typeof db.Application.associations === "object") {
        Object.keys(db.Application.associations).forEach((assoc) => {
          const association = db.Application.associations[assoc];
          applicationAssociations.push({
            name: assoc,
            type: association.associationType,
            target: association.target.name,
            foreignKey: association.foreignKey,
          });
        });
      }

      // Check Committee model associations
      const committeeAssociations = [];
      if (db.Committee && typeof db.Committee.associations === "object") {
        Object.keys(db.Committee.associations).forEach((assoc) => {
          const association = db.Committee.associations[assoc];
          committeeAssociations.push({
            name: assoc,
            type: association.associationType,
            target: association.target.name,
            foreignKey: association.foreignKey,
          });
        });
      }

      // Check CommitteeMember model associations
      const committeeMemberAssociations = [];
      if (
        db.CommitteeMember &&
        typeof db.CommitteeMember.associations === "object"
      ) {
        Object.keys(db.CommitteeMember.associations).forEach((assoc) => {
          const association = db.CommitteeMember.associations[assoc];
          committeeMemberAssociations.push({
            name: assoc,
            type: association.associationType,
            target: association.target.name,
            foreignKey: association.foreignKey,
          });
        });
      }

      // Check Meeting model associations

      const meetingAssociations = [];
      if (db.Meeting && typeof db.Meeting.associations === "object") {
        Object.keys(db.Meeting.associations).forEach((assoc) => {
          const association = db.Meeting.associations[assoc];
          meetingAssociations.push({
            name: assoc,
            type: association.associationType,
            target: association.target.name,
            foreignKey: association.foreignKey,
          });
        });
      }

      // Check MeetingDecision model associations
      const meetingDecisionAssociations = [];
      if (
        db.MeetingDecision &&
        typeof db.MeetingDecision.associations === "object"
      ) {
        Object.keys(db.MeetingDecision.associations).forEach((assoc) => {
          const association = db.MeetingDecision.associations[assoc];
          meetingDecisionAssociations.push({
            name: assoc,
            type: association.associationType,
            target: association.target.name,
            foreignKey: association.foreignKey,
          });
        });
      }

      // Check User model associations
      const userAssociations = [];
      if (db.User && typeof db.User.associations === "object") {
        Object.keys(db.User.associations).forEach((assoc) => {
          const association = db.User.associations[assoc];
          userAssociations.push({
            name: assoc,
            type: association.associationType,
            target: association.target.name,
            foreignKey: association.foreignKey,
          });
        });
      }

      return res.status(200).json({
        models,
        applicationModel: db.Application ? true : false,
        applicantModel: db.Applicant ? true : false,
        applicationAssociations,
        committeeAssociations,
        committeeMemberAssociations,
        meetingAssociations,
        meetingDecisionAssociations,
        userAssociations,
      });
    } catch (error) {
      console.error("Error checking models:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 3.1.6 Group committee members
  async createCommittee(req, res) {
    console.log("[DEBUG] Received body in createCommittee:", req.body);
    try {
      // Accept both camelCase and snake_case for compatibility
      const committee_name = req.body.committee_name || req.body.committeeName;
      const committee_type = req.body.committee_type || req.body.committeeType;
      const description = req.body.description || null;
      if (!committee_name || !committee_type) {
        return res
          .status(400)
          .json({ error: "Committee name and type are required" });
      }

      // Find the maximum committee_id and increment it
      const [maxIdResult] = await db.sequelize.query(
        'SELECT COALESCE(MAX(committee_id), 0) + 1 as next_id FROM "Committees"',
        { type: db.sequelize.QueryTypes.SELECT }
      );

      const nextId = maxIdResult.next_id;

      // Insert committee with explicit ID, using the correct column names
      // If description column exists, include it; otherwise, ignore
      try {
        await db.sequelize.query(
          `INSERT INTO "Committees" (
            committee_id, committee_name, committee_type${description !== null ? ", description" : ""}
          ) VALUES (
            ${nextId}, '${committee_name}', '${committee_type}'${description !== null ? ", '" + description.replace(/'/g, "''") + "'" : ""}
          )`
        );
      } catch (insertErr) {
        // If description column doesn't exist, try without it
        if (
          description !== null &&
          insertErr.message &&
          insertErr.message.includes("description")
        ) {
          await db.sequelize.query(
            `INSERT INTO "Committees" (
              committee_id, committee_name, committee_type
            ) VALUES (
              ${nextId}, '${committee_name}', '${committee_type}'
            )`
          );
        } else {
          throw insertErr;
        }
      }

      return res.status(201).json({
        message: "Committee created successfully",
        committeeId: nextId,
      });
    } catch (error) {
      console.error("Error creating committee:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  //see the list of committees
  async listCommittees(req, res) {
    try {
      const committees = await Committee.findAll({
        attributes: ["committee_id", "committee_name", "committee_type"],
        order: [["committee_id", "ASC"]],
      });
      // Always return 200 with an array, even if empty
      // (Frontend should handle empty array as 'no committees')
      return res.status(200).json(committees);
    } catch (error) {
      console.error("Error fetching committees:", error);
      return res.status(500).json({ error: "Failed to fetch committees" });
    }
  },

  // Delete committee
  async deleteCommittee(req, res) {
    try {
      const { committeeId } = req.params;
      console.log("=== BACKEND: deleteCommittee called ===");
      console.log("Committee ID to delete:", committeeId);

      // Use raw SQL to check committee existence
      const [committee] = await db.sequelize.query(
        'SELECT * FROM "Committees" WHERE committee_id = ?',
        {
          replacements: [committeeId],
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      if (!committee) {
        console.log("Committee not found:", committeeId);
        return res.status(404).json({ error: "Committee not found" });
      }

      console.log("Found committee:", committee);

      // Start a transaction
      const transaction = await db.sequelize.transaction();

      try {
        // Check if committee has members
        const [members] = await db.sequelize.query(
          'SELECT COUNT(*) as member_count FROM "CommitteeMembers" WHERE committee_id = ?',
          {
            replacements: [committeeId],
            type: db.sequelize.QueryTypes.SELECT,
          }
        );

        const memberCount = members.member_count;
        console.log("Committee has", memberCount, "members");

        // Check if committee has assigned applications
        const [applications] = await db.sequelize.query(
          'SELECT COUNT(*) as app_count FROM "Applications" WHERE assigned_committee_id = ?',
          {
            replacements: [committeeId],
            type: db.sequelize.QueryTypes.SELECT,
          }
        );

        const appCount = applications.app_count;
        console.log("Committee has", appCount, "assigned applications");

        // Check if committee has meetings
        const [meetings] = await db.sequelize.query(
          'SELECT COUNT(*) as meeting_count FROM "CommitteeMeetings" WHERE committee_id = ?',
          {
            replacements: [committeeId],
            type: db.sequelize.QueryTypes.SELECT,
          }
        );

        const meetingCount = meetings.meeting_count;
        console.log("Committee has", meetingCount, "meetings");

        const summary = {
          membersRemoved: memberCount,
          applicationsUnassigned: appCount,
          meetingsDeleted: meetingCount,
        };

        // Remove committee members
        if (memberCount > 0) {
          await db.sequelize.query(
            'DELETE FROM "CommitteeMembers" WHERE committee_id = ?',
            {
              replacements: [committeeId],
              type: db.sequelize.QueryTypes.DELETE,
              transaction,
            }
          );
          console.log("Removed", memberCount, "committee members");
        }

        // Unassign applications
        if (appCount > 0) {
          await db.sequelize.query(
            'UPDATE "Applications" SET assigned_committee_id = NULL WHERE assigned_committee_id = ?',
            {
              replacements: [committeeId],
              type: db.sequelize.QueryTypes.UPDATE,
              transaction,
            }
          );
          console.log("Unassigned", appCount, "applications");
        }

        // Delete meetings
        if (meetingCount > 0) {
          await db.sequelize.query(
            'DELETE FROM "CommitteeMeetings" WHERE committee_id = ?',
            {
              replacements: [committeeId],
              type: db.sequelize.QueryTypes.DELETE,
              transaction,
            }
          );
          console.log("Deleted", meetingCount, "meetings");
        }

        // Delete the committee
        await db.sequelize.query(
          'DELETE FROM "Committees" WHERE committee_id = ?',
          {
            replacements: [committeeId],
            type: db.sequelize.QueryTypes.DELETE,
            transaction,
          }
        );
        console.log("Deleted committee:", committeeId);

        // Commit the transaction
        await transaction.commit();
        console.log("Transaction committed successfully");

        console.log("=== END BACKEND DEBUG ===");

        return res.status(200).json({
          message: "Committee deleted successfully",
          committeeId,
          summary,
        });
      } catch (error) {
        // Rollback the transaction on error
        await transaction.rollback();
        console.error("Transaction rolled back due to error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error deleting committee:", error);
      return res.status(500).json({ error: "Failed to delete committee" });
    }
  },

  // Test database connection
  async testDatabase(req, res) {
    try {
      const result = await db.sequelize.query("SELECT 1 as test", {
        type: db.sequelize.QueryTypes.SELECT,
      });
      console.log("Database connection test result:", result);
      return res.status(200).json({
        message: "Database connection successful",
        result: result,
      });
    } catch (error) {
      console.error("Database connection test failed:", error);
      return res.status(500).json({
        error: "Database connection failed",
        details: error.message,
      });
    }
  },

  // Simple dashboard test
  async testDashboard(req, res) {
    try {
      // Test basic query
      const testResult = await db.sequelize.query(
        'SELECT COUNT(*) as count FROM "Applications"',
        {
          type: db.sequelize.QueryTypes.SELECT,
        }
      );

      return res.status(200).json({
        message: "Dashboard test successful",
        applicationCount: testResult[0].count,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Dashboard test failed:", error);
      return res.status(500).json({
        error: "Dashboard test failed",
        details: error.message,
      });
    }
  },

  // Debug committees endpoint
  async debugCommittees(req, res) {
    try {
      console.log("=== BACKEND: debugCommittees called ===");

      const debugInfo = {
        timestamp: new Date().toISOString(),
        database: {},
        tables: {},
        queries: {},
      };

      // Test database connection
      try {
        await db.sequelize.authenticate();
        debugInfo.database.connection = "OK";
        console.log("Database connection: OK");
      } catch (dbError) {
        debugInfo.database.connection = "ERROR: " + dbError.message;
        console.error("Database connection error:", dbError);
      }

      // Check if tables exist
      const tables = ["Committees", "CommitteeMembers", "Users"];
      for (const table of tables) {
        try {
          const [result] = await db.sequelize.query(
            `SELECT COUNT(*) as count FROM "${table}"`,
            { type: db.sequelize.QueryTypes.SELECT }
          );
          debugInfo.tables[table] = {
            exists: true,
            count: result.count,
          };
          console.log(`Table ${table}: exists, count = ${result.count}`);
        } catch (tableError) {
          debugInfo.tables[table] = {
            exists: false,
            error: tableError.message,
          };
          console.error(`Table ${table} error:`, tableError.message);
        }
      }

      // Test simple queries
      try {
        const [committees] = await db.sequelize.query(
          'SELECT committee_id, committee_name FROM "Committees" LIMIT 5',
          { type: db.sequelize.QueryTypes.SELECT }
        );
        debugInfo.queries.committees = committees;
        console.log("Sample committees:", committees);
      } catch (queryError) {
        debugInfo.queries.committees = { error: queryError.message };
        console.error("Committees query error:", queryError);
      }

      try {
        const [members] = await db.sequelize.query(
          'SELECT member_id, committee_id, user_id FROM "CommitteeMembers" LIMIT 5',
          { type: db.sequelize.QueryTypes.SELECT }
        );
        debugInfo.queries.members = members;
        console.log("Sample members:", members);
      } catch (queryError) {
        debugInfo.queries.members = { error: queryError.message };
        console.error("Members query error:", queryError);
      }

      console.log("=== END BACKEND DEBUG ===");

      return res.status(200).json(debugInfo);
    } catch (error) {
      console.error("Error in debugCommittees:", error);
      return res.status(500).json({ error: "Debug error: " + error.message });
    }
  },

  // Debug committee members endpoint
  async debugCommitteeMembers(req, res) {
    try {
      console.log("=== BACKEND: debugCommitteeMembers called ===");

      // Get all committee members
      const members = await db.sequelize.query(
        `SELECT 
          cm.member_id,
          cm.committee_id,
          cm.role,
          cm.user_id,
          c.committee_name,
          u.first_name,
          u.last_name,
          u.email,
          u.validity
        FROM "CommitteeMembers" cm
        LEFT JOIN "Committees" c ON cm.committee_id = c.committee_id
        LEFT JOIN "Users" u ON cm.user_id = u.user_id
        ORDER BY cm.committee_id, cm.member_id`,
        { type: db.sequelize.QueryTypes.SELECT }
      );

      console.log("All committee members in database:", members);

      return res.status(200).json({
        message: "Committee members debug info",
        members: members,
        total_members: members.length,
      });
    } catch (error) {
      console.error("Error in debugCommitteeMembers:", error);
      return res.status(500).json({ error: "Debug error: " + error.message });
    }
  },

  async addMembersToCommittee(req, res) {
    try {
      console.log("[DEBUG] addMembersToCommittee - Request body:", req.body);
      const { committeeId, members } = req.body;
      console.log("=== BACKEND: addMembersToCommittee called ===");
      console.log("Committee ID:", committeeId);
      console.log("Members to add:", members);

      // Use raw SQL to check committee existence
      const [committee] = await db.sequelize.query(
        'SELECT * FROM "Committees" WHERE committee_id = ?',
        {
          replacements: [committeeId],
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      if (!committee) {
        console.log("Committee not found:", committeeId);
        return res.status(404).json({ error: "Committee not found" });
      }
      console.log("Found committee:", committee);

      const errors = [];
      const committeeMembers = [];
      const successfulAdditions = [];

      for (const member of members) {
        // Check if user exists
        const user = await User.findByPk(member.userId);
        if (!user) {
          errors.push(`User with ID ${member.userId} does not exist.`);
          continue;
        }
        // Check if already a member
        const alreadyMember = await CommitteeMember.findOne({
          where: { user_id: member.userId, committee_id: committeeId },
        });
        if (alreadyMember) {
          errors.push(
            `User with ID ${member.userId} is already a member of committee ${committeeId}.`
          );
          continue;
        }
        // Add to list to create
        committeeMembers.push({
          user_id: member.userId,
          committee_id: committeeId,
          role: member.role || "MEMBER",
        });
        successfulAdditions.push({ user, role: member.role || "MEMBER" });
      }

      if (committeeMembers.length > 0) {
        console.log("Creating committee members:", committeeMembers);
        await CommitteeMember.bulkCreate(committeeMembers);
        console.log(
          "Successfully created",
          committeeMembers.length,
          "committee members"
        );

        // Verify the members were actually added
        const [verificationResults] = await db.sequelize.query(
          'SELECT * FROM "CommitteeMembers" WHERE committee_id = ?',
          {
            replacements: [committeeId],
            type: db.sequelize.QueryTypes.SELECT,
          }
        );
        console.log(
          "Verification - All members in committee:",
          verificationResults
        );

        // Send notification emails to successfully added members
        for (const { user, role } of successfulAdditions) {
          try {
            const { subject, html, text } = buildCommitteeAdditionEmail({
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              committeeName: committee.committee_name,
              committeeType: committee.committee_type,
              role: role,
            });

            await sendMail({
              to: user.email,
              subject,
              text,
              html,
            });

            console.log("Committee addition notification sent to:", user.email);
          } catch (emailError) {
            console.error(
              "Failed to send committee addition notification:",
              emailError
            );
            // Continue even if email fails
          }
        }
      }

      if (errors.length > 0) {
        console.log("[DEBUG] addMembersToCommittee - Errors:", errors);
        return res.status(207).json({
          message: "Some members could not be added.",
          errors,
          added: committeeMembers.map((m) => m.user_id),
        });
      }
      console.log(
        "[DEBUG] addMembersToCommittee - Success, added:",
        committeeMembers.map((m) => m.user_id)
      );
      return res.status(200).json({
        message: "Members added to committee successfully",
        added: committeeMembers.map((m) => m.user_id),
      });
    } catch (error) {
      console.error("[DEBUG] addMembersToCommittee - Error:", error);
      return res.status(500).json({
        error: "Failed to add members to committee",
        details: error.message,
      });
    }
  },

  // Remove members from committee
  async removeMembersFromCommittee(req, res) {
    try {
      console.log(
        "[DEBUG] removeMembersFromCommittee - Request body:",
        req.body
      );
      const { committeeId, memberIds } = req.body;

      // Use raw SQL to check committee existence
      const [committee] = await db.sequelize.query(
        'SELECT * FROM "Committees" WHERE committee_id = ?',
        {
          replacements: [committeeId],
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      if (!committee) {
        return res.status(404).json({ error: "Committee not found" });
      }

      const errors = [];
      const successfulRemovals = [];

      for (const memberId of memberIds) {
        // Check if user exists
        const user = await User.findByPk(memberId);
        if (!user) {
          errors.push(`User with ID ${memberId} does not exist.`);
          continue;
        }

        // Check if user is a member of this committee
        const committeeMember = await CommitteeMember.findOne({
          where: { user_id: memberId, committee_id: committeeId },
        });
        if (!committeeMember) {
          errors.push(
            `User with ID ${memberId} is not a member of committee ${committeeId}.`
          );
          continue;
        }

        // Store member info for email notification
        successfulRemovals.push({
          user,
          role: committeeMember.role,
        });

        // Remove from committee
        await committeeMember.destroy();
      }

      // Send notification emails to successfully removed members
      for (const { user, role } of successfulRemovals) {
        try {
          const { subject, html, text } = buildCommitteeRemovalEmail({
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            committeeName: committee.committee_name,
            committeeType: committee.committee_type,
            role: role,
          });

          await sendMail({
            to: user.email,
            subject,
            text,
            html,
          });

          console.log("Committee removal notification sent to:", user.email);
        } catch (emailError) {
          console.error(
            "Failed to send committee removal notification:",
            emailError
          );
          // Continue even if email fails
        }
      }

      if (errors.length > 0) {
        console.log("[DEBUG] removeMembersFromCommittee - Errors:", errors);
        return res.status(207).json({
          message: "Some members could not be removed.",
          errors,
          removed: successfulRemovals.map((r) => r.user.user_id),
        });
      }
      console.log(
        "[DEBUG] removeMembersFromCommittee - Success, removed:",
        successfulRemovals.map((r) => r.user.user_id)
      );
      return res.status(200).json({
        message: "Members removed from committee successfully",
        removed: successfulRemovals.map((r) => r.user.user_id),
      });
    } catch (error) {
      console.error("[DEBUG] removeMembersFromCommittee - Error:", error);
      return res.status(500).json({
        error: "Failed to remove members from committee",
        details: error.message,
      });
    }
  },

  // TEMPORARY: Add missing columns to Applications table
  async addMissingApplicationColumns(req, res) {
    try {
      await db.sequelize.query(`
        ALTER TABLE "Applications"
        ADD COLUMN IF NOT EXISTS admin_comments TEXT NULL,
        ADD COLUMN IF NOT EXISTS preliminary_check_date TIMESTAMP WITH TIME ZONE NULL,
        ADD COLUMN IF NOT EXISTS decision_date TIMESTAMP WITH TIME ZONE NULL;
      `);
      return res.status(200).json({
        message:
          "Missing columns added to Applications table (if not already present).",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // TEMPORARY: Add all missing columns to Applications table
  async addAllMissingApplicationColumns(req, res) {
    try {
      // Add all missing columns to Applications table
      await db.sequelize.query(`
        ALTER TABLE "Applications" 
        ADD COLUMN IF NOT EXISTS "review_status" VARCHAR(50) DEFAULT 'PENDING',
        ADD COLUMN IF NOT EXISTS "review_notes" TEXT,
        ADD COLUMN IF NOT EXISTS "review_date" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "reviewer_id" INTEGER,
        ADD COLUMN IF NOT EXISTS "committee_id" INTEGER,
        ADD COLUMN IF NOT EXISTS "meeting_id" INTEGER,
        ADD COLUMN IF NOT EXISTS "decision_date" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "decision_notes" TEXT,
        ADD COLUMN IF NOT EXISTS "letter_generated" BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS "letter_date" TIMESTAMP,
        ADD COLUMN IF NOT EXISTS "email_sent" BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS "email_date" TIMESTAMP
      `);

      return res.status(200).json({
        message: "All missing application columns added successfully",
      });
    } catch (error) {
      console.error("Error adding missing application columns:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Dashboard Statistics
  async getDashboardStats(req, res) {
    try {
      // Get applications statistics with error handling
      let applicationsStats = [
        {
          total_applications: 0,
          pending_applications: 0,
          approved_applications: 0,
          rejected_applications: 0,
        },
      ];
      try {
        applicationsStats = await db.sequelize.query(
          `
          SELECT 
            COUNT(*) as total_applications,
            COUNT(CASE WHEN status = 'SUBMITTED' THEN 1 END) as pending_applications,
            COUNT(CASE WHEN status = 'APPROVED' THEN 1 END) as approved_applications,
            COUNT(CASE WHEN status = 'REJECTED' THEN 1 END) as rejected_applications
          FROM "Applications"
        `,
          { type: db.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.error("Error fetching applications stats:", error);
      }

      // Get committees statistics with error handling
      let committeesStats = [{ total_committees: 0, active_committees: 0 }];
      try {
        committeesStats = await db.sequelize.query(
          `
          SELECT 
            COUNT(*) as total_committees,
            COUNT(*) as active_committees
          FROM "Committees"
        `,
          { type: db.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.error("Error fetching committees stats:", error);
      }

      // Get users statistics with error handling
      let usersStats = [{ total_users: 0, active_users: 0 }];
      try {
        usersStats = await db.sequelize.query(
          `
          SELECT 
            COUNT(*) as total_users,
            COUNT(CASE WHEN validity = true THEN 1 END) as active_users
          FROM "Users"
        `,
          { type: db.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.error("Error fetching users stats:", error);
      }

      // Get meetings statistics with error handling
      let meetingsStats = [
        { total_meetings: 0, upcoming_meetings: 0, completed_meetings: 0 },
      ];
      try {
        meetingsStats = await db.sequelize.query(
          `
          SELECT 
            COUNT(*) as total_meetings,
            COUNT(CASE WHEN meeting_date > NOW() THEN 1 END) as upcoming_meetings,
            COUNT(CASE WHEN meeting_date <= NOW() THEN 1 END) as completed_meetings
          FROM "CommitteeMeetings"
        `,
          { type: db.sequelize.QueryTypes.SELECT }
        );
      } catch (error) {
        console.error("Error fetching meetings stats:", error);
      }

      // Calculate approval rate
      const totalApplications = applicationsStats[0].total_applications || 0;
      const approvedApplications =
        applicationsStats[0].approved_applications || 0;
      const approvalRate =
        totalApplications > 0
          ? ((approvedApplications / totalApplications) * 100).toFixed(1)
          : 0;

      // Calculate average processing time with error handling
      let averageProcessingTime = 3.2; // Default fallback
      try {
        const processingTimeStats = await db.sequelize.query(
          `
          SELECT 
            AVG(EXTRACT(EPOCH FROM (last_updated - submission_date))/86400) as avg_processing_days
          FROM "Applications" 
          WHERE status IN ('APPROVED', 'REJECTED') AND last_updated IS NOT NULL
        `,
          { type: db.sequelize.QueryTypes.SELECT }
        );

        if (processingTimeStats[0].avg_processing_days) {
          averageProcessingTime = parseFloat(
            processingTimeStats[0].avg_processing_days
          ).toFixed(1);
        }
      } catch (error) {
        console.error("Error calculating processing time:", error);
      }

      const stats = {
        totalApplications:
          parseInt(applicationsStats[0].total_applications) || 0,
        pendingApplications:
          parseInt(applicationsStats[0].pending_applications) || 0,
        approvedApplications:
          parseInt(applicationsStats[0].approved_applications) || 0,
        rejectedApplications:
          parseInt(applicationsStats[0].rejected_applications) || 0,
        totalCommittees: parseInt(committeesStats[0].total_committees) || 0,
        activeCommittees: parseInt(committeesStats[0].active_committees) || 0,
        totalUsers: parseInt(usersStats[0].total_users) || 0,
        activeUsers: parseInt(usersStats[0].active_users) || 0,
        upcomingMeetings: parseInt(meetingsStats[0].upcoming_meetings) || 0,
        completedMeetings: parseInt(meetingsStats[0].completed_meetings) || 0,
        averageProcessingTime: parseFloat(averageProcessingTime),
        approvalRate: parseFloat(approvalRate),
      };

      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch dashboard statistics" });
    }
  },

  // Recent Activities
  async getRecentActivities(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activities = [];

      // Get recent applications with error handling
      try {
        const recentApplications = await db.sequelize.query(
          `
          SELECT 
            a.application_id,
            a.status,
            a.submission_date,
            a.last_updated,
            CONCAT(ap.first_name, ' ', ap.last_name) as applicant_name,
            ap.email as applicant_email
          FROM "Applications" a
          LEFT JOIN "Applicants" ap ON a.applicant_id = ap.applicant_id
          ORDER BY a.last_updated DESC, a.submission_date DESC
          LIMIT ${limit}
        `,
          { type: db.sequelize.QueryTypes.SELECT }
        );

        // Add application activities
        recentApplications.forEach((app, index) => {
          activities.push({
            id: `app_${app.application_id}`,
            type: "application",
            action: `Application ${app.status === "SUBMITTED" ? "submitted" : app.status.toLowerCase()}`,
            user: app.applicant_name || "Unknown Applicant",
            time: new Date(
              app.last_updated || app.submission_date
            ).toLocaleDateString(),
            status: app.status.toLowerCase(),
            timestamp: new Date(
              app.last_updated || app.submission_date
            ).getTime(),
          });
        });
      } catch (error) {
        console.error("Error fetching recent applications:", error);
      }

      // Get recent meetings with error handling
      try {
        const recentMeetings = await db.sequelize.query(
          `
          SELECT 
            cm.meeting_id,
            cm.meeting_date,
            cm.status,
            cm.created_at,
            c.committee_name
          FROM "CommitteeMeetings" cm
          LEFT JOIN "Committees" c ON cm.committee_id = c.committee_id
          ORDER BY cm.created_at DESC
          LIMIT 5
          `,
          { type: db.sequelize.QueryTypes.SELECT }
        );

        // Add meeting activities
        recentMeetings.forEach((meeting, index) => {
          activities.push({
            id: `meeting_${meeting.meeting_id}`,
            type: "meeting",
            action: `Meeting ${meeting.status.toLowerCase()}`,
            user: `${meeting.committee_name} Committee`,
            time: new Date(meeting.created_at).toLocaleDateString(),
            status: meeting.status.toLowerCase(),
            timestamp: new Date(meeting.created_at).getTime(),
          });
        });
      } catch (error) {
        console.error("Error fetching recent meetings:", error);
      }

      // Sort activities by timestamp
      activities.sort((a, b) => b.timestamp - a.timestamp);

      return res.status(200).json(activities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return res.status(500).json({ error: error.message });
    }
  },

  // Admin Analytics
  async getAnalyticsData(req, res) {
    try {
      // Users
      const totalUsers = await db.User.count();
      const activeUsers = await db.User.count({ where: { validity: true } });
      const blockedUsers = await db.User.count({ where: { validity: false } });

      // Committees
      const totalCommittees = await db.Committee.count();
      const committeesByTypeRaw = await db.Committee.findAll({
        attributes: [
          "committee_type",
          [db.Sequelize.fn("COUNT", db.Sequelize.col("committee_id")), "count"],
        ],
        group: ["committee_type"],
        raw: true,
      });
      const committeesByType = {};
      if (Array.isArray(committeesByTypeRaw)) {
        committeesByTypeRaw.forEach((row) => {
          if (row && row.committee_type && row.count !== undefined) {
            committeesByType[row.committee_type] = parseInt(row.count);
          }
        });
      }

      // Applications
      const totalApplications = await db.Application.count();
      const applicationsByStatusRaw = await db.Application.findAll({
        attributes: [
          "status",
          [
            db.Sequelize.fn("COUNT", db.Sequelize.col("application_id")),
            "count",
          ],
        ],
        group: ["status"],
        raw: true,
      });
      const applicationsByStatus = {};
      if (Array.isArray(applicationsByStatusRaw)) {
        applicationsByStatusRaw.forEach((row) => {
          if (row && row.status && row.count !== undefined) {
            applicationsByStatus[row.status] = parseInt(row.count);
          }
        });
      }

      // Applications per committee
      const applicationsPerCommitteeRaw = await db.Application.findAll({
        attributes: [
          "assigned_committee_id",
          [
            db.Sequelize.fn("COUNT", db.Sequelize.col("application_id")),
            "count",
          ],
        ],
        group: ["assigned_committee_id"],
        raw: true,
      });
      const applicationsPerCommittee = {};
      if (Array.isArray(applicationsPerCommitteeRaw)) {
        applicationsPerCommitteeRaw.forEach((row) => {
          if (
            row &&
            row.assigned_committee_id !== undefined &&
            row.count !== undefined
          ) {
            applicationsPerCommittee[row.assigned_committee_id] = parseInt(
              row.count
            );
          }
        });
      }

      // Applications per month (last 12 months)
      const applicationsPerMonthRaw = await db.sequelize.query(
        `SELECT to_char(submission_date, 'YYYY-MM') as month, COUNT(*) as count
         FROM "Applications"
         WHERE submission_date >= (CURRENT_DATE - INTERVAL '12 months')
         GROUP BY month
         ORDER BY month ASC`,
        { type: db.sequelize.QueryTypes.SELECT }
      );
      const applicationsPerMonth = {};
      if (Array.isArray(applicationsPerMonthRaw)) {
        applicationsPerMonthRaw.forEach((row) => {
          if (row && row.month && row.count !== undefined) {
            applicationsPerMonth[row.month] = parseInt(row.count);
          }
        });
      }
      console.log("[DEBUG] applicationsPerMonthRaw:", applicationsPerMonthRaw);

      // Meetings
      const totalMeetings = await db.Meeting.count();
      const upcomingMeetings = await db.Meeting.count({
        where: { meeting_date: { [db.Sequelize.Op.gt]: new Date() } },
      });
      const completedMeetings = await db.Meeting.count({
        where: { meeting_date: { [db.Sequelize.Op.lte]: new Date() } },
      });

      // Average application processing time (in days)
      const avgProcessingRaw = await db.sequelize.query(
        `SELECT AVG(EXTRACT(EPOCH FROM (last_updated - submission_date))/86400) as avg_days
         FROM "Applications"
         WHERE status IN ('APPROVED', 'REJECTED') AND last_updated IS NOT NULL`,
        { type: db.sequelize.QueryTypes.SELECT }
      );
      const averageProcessingTime = avgProcessingRaw[0].avg_days
        ? parseFloat(avgProcessingRaw[0].avg_days).toFixed(2)
        : null;

      // Approval rate
      const approved = applicationsByStatus["APPROVED"] || 0;
      const approvalRate =
        totalApplications > 0
          ? ((approved / totalApplications) * 100).toFixed(2)
          : null;

      // Build analytics object
      return res.status(200).json({
        users: {
          total: totalUsers,
          active: activeUsers,
          blocked: blockedUsers,
        },
        committees: {
          total: totalCommittees,
          byType: committeesByType,
        },
        applications: {
          total: totalApplications,
          byStatus: applicationsByStatus,
          perCommittee: applicationsPerCommittee,
          perMonth: applicationsPerMonth,
        },
        meetings: {
          total: totalMeetings,
          upcoming: upcomingMeetings,
          completed: completedMeetings,
        },
        averageProcessingTime,
        approvalRate,
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      return res.status(500).json({ error: "Failed to fetch analytics data" });
    }
  },

  // Add is_2fa_enabled column to Users table (idempotent, raw SQL)
  async add2FAColumn(req, res) {
    try {
      await db.sequelize.query(
        'ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS is_2fa_enabled BOOLEAN DEFAULT FALSE;'
      );
      return res
        .status(200)
        .json({ message: "is_2fa_enabled column added (or already exists)." });
    } catch (error) {
      console.error("Error adding is_2fa_enabled column:", error);
      return res.status(500).json({ error: error.message });
    }
  },
};

// In-memory store for 2FA codes (for demo; use Redis or DB in production)
const twoFACodeStore = {};

// Enable or disable 2FA for admin
async function set2FA(req, res) {
  try {
    const userId = req.user.user_id;
    const { enable } = req.body;
    const user = await db.User.findByPk(userId);
    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can enable/disable 2FA.' });
    }
    await db.User.update({ is_2fa_enabled: !!enable }, { where: { user_id: userId } });
    return res.status(200).json({ message: `2FA ${enable ? 'enabled' : 'disabled'} for admin.` });
  } catch (error) {
    console.error('Error setting 2FA:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Request a 2FA code (send via email)
async function request2FACode(req, res) {
  try {
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user || user.role !== 'ADMIN' || !user.is_2fa_enabled) {
      return res.status(400).json({ error: '2FA not enabled for this admin.' });
    }
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Store code with expiry (5 min)
    twoFACodeStore[user.user_id] = { code, expires: Date.now() + 5 * 60 * 1000 };
    // Send code via email
    await require('../utils/email-service').sendMail({
      to: user.email,
      subject: 'Your Admin 2FA Verification Code',
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <b>${code}</b></p>`
    });
    return res.status(200).json({ message: '2FA code sent to email.' });
  } catch (error) {
    console.error('Error sending 2FA code:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Verify 2FA code
async function verify2FACode(req, res) {
  try {
    const { email, code } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user || user.role !== 'ADMIN' || !user.is_2fa_enabled) {
      return res.status(400).json({ error: '2FA not enabled for this admin.' });
    }
    const entry = twoFACodeStore[user.user_id];
    if (!entry || entry.code !== code) {
      return res.status(400).json({ error: 'Invalid or expired 2FA code.' });
    }
    if (Date.now() > entry.expires) {
      delete twoFACodeStore[user.user_id];
      return res.status(400).json({ error: '2FA code expired.' });
    }
    // Success: remove code
    delete twoFACodeStore[user.user_id];
    return res.status(200).json({ message: '2FA verification successful.' });
  } catch (error) {
    console.error('Error verifying 2FA code:', error);
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {
  ...adminController,
  add2FAColumn: adminController.add2FAColumn,
  set2FA,
  request2FACode,
  verify2FACode,
};
