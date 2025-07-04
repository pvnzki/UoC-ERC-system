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
            user_id, committee_id, role, is_active, created_at, updated_at
          ) VALUES (
            ${userId}, ${committeeId}, '${role === "COMMITTEE_MEMBER" ? "MEMBER" : "STAFF"}', 
            true, NOW(), NOW()
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
      const committees = await Committee.findAll({
        include: [
          {
            model: CommitteeMember,
            as: "members",
            include: [
              {
                model: User,
                as: "user",
                attributes: [
                  "user_id",
                  "first_name",
                  "last_name",
                  "email",
                  "is_active",
                ],
              },
            ],
          },
        ],
      });

      return res.status(200).json(committees);
    } catch (error) {
      console.error("Error listing reviewers:", error);
      return res.status(500).json({ error: "Failed to list reviewers" });
    }
  },

  // 3.1.5 Block/Remove accounts
  async updateUserStatus(req, res) {
    try {
      const { userId, validity, reason } = req.body;

      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

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
    try {
      const { name, type } = req.body;

      if (!name || !type) {
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
      await db.sequelize.query(`
      INSERT INTO "Committees" (
        committee_id, committee_name, committee_type
      ) VALUES (
        ${nextId}, '${name}', '${type}'
      )
    `);

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
      if (!committees || committees.length === 0) {
        return res.status(404).json({ error: "No committees found" });
      }
      // Return the list of committees
      console.log("=== Committees ===");
      console.log(committees);
      console.log("===================");
      return res.status(200).json(committees);
    } catch (error) {
      console.error("Error fetching committees:", error);
      return res.status(500).json({ error: "Failed to fetch committees" });
    }
  },

  async addMembersToCommittee(req, res) {
    try {
      const { committeeId, members } = req.body;

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
          is_active: true,
        });
        successfulAdditions.push({ user, role: member.role || "MEMBER" });
      }

      if (committeeMembers.length > 0) {
        await CommitteeMember.bulkCreate(committeeMembers);

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
        return res.status(207).json({
          message: "Some members could not be added.",
          errors,
          added: committeeMembers.map((m) => m.user_id),
        });
      }

      return res.status(200).json({
        message: "Members added to committee successfully",
        added: committeeMembers.map((m) => m.user_id),
      });
    } catch (error) {
      console.error("Error adding members to committee:", error);
      return res
        .status(500)
        .json({ error: "Failed to add members to committee" });
    }
  },

  // Remove members from committee
  async removeMembersFromCommittee(req, res) {
    try {
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
        return res.status(207).json({
          message: "Some members could not be removed.",
          errors,
          removed: successfulRemovals.map((r) => r.user.user_id),
        });
      }

      return res.status(200).json({
        message: "Members removed from committee successfully",
        removed: successfulRemovals.map((r) => r.user.user_id),
      });
    } catch (error) {
      console.error("Error removing members from committee:", error);
      return res
        .status(500)
        .json({ error: "Failed to remove members from committee" });
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
      await db.sequelize.query(`
        ALTER TABLE "Applications"
        ADD COLUMN IF NOT EXISTS admin_comments TEXT NULL,
        ADD COLUMN IF NOT EXISTS preliminary_check_date TIMESTAMP WITH TIME ZONE NULL,
        ADD COLUMN IF NOT EXISTS decision_date TIMESTAMP WITH TIME ZONE NULL,
        ADD COLUMN IF NOT EXISTS is_extension BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE NULL,
        ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE NULL,
        ADD COLUMN IF NOT EXISTS assigned_committee_id INTEGER NULL,
        ADD COLUMN IF NOT EXISTS status VARCHAR(255) DEFAULT 'DRAFT',
        ADD COLUMN IF NOT EXISTS submission_date TIMESTAMP WITH TIME ZONE NULL,
        ADD COLUMN IF NOT EXISTS application_type VARCHAR(255) NULL,
        ADD COLUMN IF NOT EXISTS research_type VARCHAR(255) NULL,
        ADD COLUMN IF NOT EXISTS applicant_id INTEGER NULL,
        ADD COLUMN IF NOT EXISTS application_id SERIAL PRIMARY KEY;
      `);
      // Add foreign key for assigned_committee_id
      await db.sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_assigned_committee'
              AND table_name = 'Applications'
          ) THEN
            ALTER TABLE "Applications"
            ADD CONSTRAINT fk_assigned_committee
            FOREIGN KEY (assigned_committee_id)
            REFERENCES "Committees"(committee_id)
            ON UPDATE CASCADE
            ON DELETE SET NULL;
          END IF;
        END$$;
      `);
      // Add foreign key for applicant_id
      await db.sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'fk_applicant_id'
              AND table_name = 'Applications'
          ) THEN
            ALTER TABLE "Applications"
            ADD CONSTRAINT fk_applicant_id
            FOREIGN KEY (applicant_id)
            REFERENCES "Applicants"(applicant_id)
            ON UPDATE CASCADE
            ON DELETE SET NULL;
          END IF;
        END$$;
      `);
      return res.status(200).json({
        message:
          "All missing columns and foreign keys added to Applications table (if not already present).",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = adminController;
