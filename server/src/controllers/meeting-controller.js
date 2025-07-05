const {
  CommitteeMeeting,
  MeetingApplication,
  Application,
  Committee,
  User,
  Applicant,
  CommitteeMember,
  sequelize,
} = require("../models");
const { sendMail } = require("../utils/email-service");
const {
  generateApprovalLetter,
  generateRejectionLetter,
} = require("../utils/document-generator");

const meetingController = {
  // Create a new committee meeting
  async createMeeting(req, res) {
    try {
      const { committee_id, meeting_date, agenda, applicationIds } = req.body;

      console.log("Creating meeting with data:", {
        committee_id,
        meeting_date,
        agenda,
        applicationIds,
      });

      // Use raw SQL to get committee data with actual column names
      const [committee] = await sequelize.query(
        'SELECT committee_id, committee_name, committee_type FROM "Committees" WHERE committee_id = ?',
        {
          replacements: [committee_id],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!committee) {
        return res.status(404).json({ error: "Committee not found" });
      }

      console.log("Committee found:", committee.committee_name);

      // Begin transaction
      const transaction = await sequelize.transaction();

      try {
        // Create meeting
        const meeting = await CommitteeMeeting.create(
          {
            committee_id: committee_id,
            meeting_date: meeting_date,
            agenda,
            status: "SCHEDULED",
          },
          { transaction }
        );

        console.log("Meeting created:", meeting.meeting_id);

        // Add applications to meeting if provided
        if (applicationIds && applicationIds.length > 0) {
          const meetingApplications = applicationIds.map((appId) => ({
            meeting_id: meeting.meeting_id,
            application_id: appId,
            decision: "PENDING",
          }));

          await MeetingApplication.bulkCreate(meetingApplications, {
            transaction,
          });
          console.log("Applications added to meeting");
        }

        await transaction.commit();

        // Notify committee members about the meeting
        const committeeMembers = await CommitteeMember.findAll({
          where: { committee_id: committee_id, is_active: true },
          include: [{ model: User, as: "user" }],
        });

        console.log("Found committee members:", committeeMembers.length);

        const emailPromises = committeeMembers.map((member) =>
          sendMail({
            to: member.user.email,
            subject: `New ${committee.committee_name} Meeting Scheduled`,
            text: `Dear ${member.user.first_name} ${member.user.last_name},\n\nA new committee meeting has been scheduled for ${new Date(meeting_date).toLocaleString()}.\n\nAgenda: ${agenda || "Not specified"}\n\nPlease log in to the ERC system for more details.\n\nRegards,\nERC Admin Team`,
          })
        );

        await Promise.all(emailPromises);

        return res.status(201).json({
          message: "Committee meeting created successfully",
          meetingId: meeting.meeting_id,
        });
      } catch (error) {
        await transaction.rollback();
        console.error("Transaction error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error creating committee meeting:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      return res
        .status(500)
        .json({ error: "Failed to create committee meeting" });
    }
  },

  // 3.3.1 Ratify decisions from committee meeting
  async ratifyDecisions(req, res) {
    try {
      const { meetingId } = req.params;
      const { decisions } = req.body;

      console.log("Ratifying decisions for meeting:", meetingId);
      console.log("Decisions:", decisions);

      // Use raw SQL to get meeting data with actual column names
      const [meeting] = await sequelize.query(
        `SELECT 
          cm.meeting_id,
          cm.committee_id,
          cm.meeting_date,
          cm.agenda,
          cm.minutes,
          cm.status,
          c.committee_name,
          c.committee_type
        FROM "CommitteeMeetings" cm
        LEFT JOIN "Committees" c ON cm.committee_id = c.committee_id
        WHERE cm.meeting_id = ?`,
        {
          replacements: [meetingId],
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (!meeting) {
        console.log("Meeting not found:", meetingId);
        return res.status(404).json({ error: "Meeting not found" });
      }

      console.log("Meeting found:", meeting);

      // Begin transaction
      const transaction = await sequelize.transaction();

      try {
        // Process each decision
        for (const decision of decisions) {
          const meetingApp = await MeetingApplication.findOne({
            where: {
              meeting_id: meetingId,
              application_id: decision.applicationId,
            },
            transaction,
          });

          if (!meetingApp) {
            continue;
          }

          // Update meeting application with ratified decision
          meetingApp.decision = decision.decision;
          meetingApp.decision_comments = decision.comments;
          meetingApp.ratified = true;
          await meetingApp.save({ transaction });

          // Update the application status
          const application = await Application.findByPk(
            decision.applicationId,
            { transaction }
          );

          if (decision.decision === "APPROVED") {
            application.status = "APPROVED";
            application.decision_date = new Date();
          } else if (decision.decision === "REJECTED") {
            application.status = "REJECTED";
            application.decision_date = new Date();
          } else if (decision.decision === "REVISE") {
            application.status = "RETURNED_FOR_RESUBMISSION";
          }

          application.admin_comments = decision.comments;
          await application.save({ transaction });

          // Get applicant details for email
          const fullApplication = await Application.findByPk(
            decision.applicationId,
            {
              include: [
                {
                  model: Applicant,
                  as: "applicant",
                  include: [{ model: User, as: "user" }],
                },
              ],
              transaction,
            }
          );

          // Send email based on decision
          const applicantEmail = fullApplication.applicant.user.email;
          const applicantName = `${fullApplication.applicant.user.first_name} ${fullApplication.applicant.user.last_name}`;

          let emailSubject, emailText, attachment;

          if (decision.decision === "APPROVED") {
            emailSubject = "ERC Application Approved";
            emailText = `Dear ${applicantName},\n\nWe are pleased to inform you that your application has been approved by the ${meeting.committee_name}.\n\n${decision.comments ? `Comments: ${decision.comments}\n\n` : ""}Please find the approval letter attached.\n\nRegards,\nERC Admin Team`;
            attachment = {
              filename: `approval_letter_${decision.applicationId}.pdf`,
              content: await generateApprovalLetter(fullApplication),
            };
          } else if (decision.decision === "REJECTED") {
            emailSubject = "ERC Application Rejected";
            emailText = `Dear ${applicantName},\n\nWe regret to inform you that your application has been rejected by the ${meeting.committee_name}.\n\n${decision.comments ? `Reason: ${decision.comments}\n\n` : ""}Please find the rejection letter attached.\n\nRegards,\nERC Admin Team`;
            attachment = {
              filename: `rejection_letter_${decision.applicationId}.pdf`,
              content: await generateRejectionLetter(fullApplication),
            };
          } else if (decision.decision === "REVISE") {
            emailSubject = "ERC Application Requires Revision";
            emailText = `Dear ${applicantName},\n\nYour application has been reviewed by the ${meeting.committee_name} and requires revision.\n\n${decision.comments ? `Comments: ${decision.comments}\n\n` : ""}Please log in to the ERC system to revise and resubmit your application.\n\nRegards,\nERC Admin Team`;
          }

          await sendMail({
            to: applicantEmail,
            subject: emailSubject,
            text: emailText,
            attachments: attachment ? [attachment] : undefined,
          });
        }

        // Update meeting status if all decisions are ratified
        const [unratifiedCount] = await sequelize.query(
          `SELECT COUNT(*) as count FROM "MeetingApplications" 
           WHERE meeting_id = ? AND ratified = false`,
          {
            replacements: [meetingId],
            type: sequelize.QueryTypes.SELECT,
            transaction,
          }
        );

        if (unratifiedCount.count === 0) {
          await sequelize.query(
            `UPDATE "CommitteeMeetings" SET status = 'COMPLETED' WHERE meeting_id = ?`,
            {
              replacements: [meetingId],
              transaction,
            }
          );
          console.log("Meeting marked as completed");
        }

        await transaction.commit();

        return res.status(200).json({
          message: "Decisions ratified successfully",
          meetingId: meeting.meeting_id,
        });
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Error ratifying decisions:", error);
      return res.status(500).json({ error: "Failed to ratify decisions" });
    }
  },

  // 3.3.2 Generate summary of decisions
  async generateMeetingSummary(req, res) {
    try {
      const { dateFrom, dateTo, committeeId } = req.query;

      let whereClause = "";
      const replacements = [];

      if (dateFrom && dateTo) {
        whereClause = "WHERE cm.meeting_date BETWEEN ? AND ?";
        replacements.push(dateFrom, dateTo);
      } else if (dateFrom) {
        whereClause = "WHERE cm.meeting_date >= ?";
        replacements.push(dateFrom);
      } else if (dateTo) {
        whereClause = "WHERE cm.meeting_date <= ?";
        replacements.push(dateTo);
      }

      if (committeeId) {
        whereClause += whereClause
          ? " AND cm.committee_id = ?"
          : "WHERE cm.committee_id = ?";
        replacements.push(committeeId);
      }

      const meetings = await sequelize.query(
        `
        SELECT 
          cm.meeting_id,
          cm.committee_id,
          cm.meeting_date,
          cm.agenda,
          cm.minutes,
          cm.status,
          c.committee_name,
          c.committee_type
        FROM "CommitteeMeetings" cm
        LEFT JOIN "Committees" c ON cm.committee_id = c.committee_id
        ${whereClause}
        ORDER BY cm.meeting_date DESC
      `,
        {
          replacements,
          type: sequelize.QueryTypes.SELECT,
        }
      );

      // Get applications for each meeting
      const summary = [];
      for (const meeting of meetings) {
        const applications = await sequelize.query(
          `
          SELECT 
            ma.application_id,
            ma.decision,
            ma.ratified,
            a.research_type,
            a.application_type,
            a.status as application_status,
            app.first_name,
            app.last_name,
            u.email
          FROM "MeetingApplications" ma
          LEFT JOIN "Applications" a ON ma.application_id = a.application_id
          LEFT JOIN "Applicants" app ON a.applicant_id = app.applicant_id
          LEFT JOIN "Users" u ON app.user_id = u.user_id
          WHERE ma.meeting_id = ?
        `,
          {
            replacements: [meeting.meeting_id],
            type: sequelize.QueryTypes.SELECT,
          }
        );

        const decisions = {
          APPROVED: 0,
          REJECTED: 0,
          REVISE: 0,
          PENDING: 0,
        };

        applications.forEach((app) => {
          decisions[app.decision]++;
        });

        summary.push({
          meetingId: meeting.meeting_id,
          committeeId: meeting.committee_id,
          committeeName: meeting.committee_name,
          meetingDate: meeting.meeting_date,
          status: meeting.status,
          totalApplications: applications.length,
          decisions,
          applications: applications.map((app) => ({
            applicationId: app.application_id,
            researchType: app.research_type,
            applicationType: app.application_type,
            applicantName:
              `${app.first_name || ""} ${app.last_name || ""}`.trim(),
            decision: app.decision,
            ratified: app.ratified,
          })),
        });
      }

      return res.status(200).json(summary);
    } catch (error) {
      console.error("Error generating meeting summary:", error);
      return res
        .status(500)
        .json({ error: "Failed to generate meeting summary" });
    }
  },

  // 3.3.3, 3.3.4 Generate approval/rejection letters
  async generateLetter(req, res) {
    try {
      const { applicationId } = req.params;
      const { letterType } = req.query;

      console.log(
        "Generating letter for application:",
        applicationId,
        "type:",
        letterType
      );

      const application = await Application.findByPk(applicationId, {
        include: [
          {
            model: Applicant,
            as: "applicant",
            include: [{ model: User, as: "user" }],
          },
        ],
      });

      if (!application) {
        console.log("Application not found:", applicationId);
        return res.status(404).json({ error: "Application not found" });
      }

      console.log("Application found:", {
        id: application.application_id,
        research_type: application.research_type,
        application_type: application.application_type,
        applicant: application.applicant
          ? {
              name: `${application.applicant.user.first_name} ${application.applicant.user.last_name}`,
              email: application.applicant.user.email,
            }
          : null,
      });

      let letter;

      try {
        if (letterType === "approval") {
          console.log("Generating approval letter...");
          letter = await generateApprovalLetter(application);
        } else if (letterType === "rejection") {
          console.log("Generating rejection letter...");
          letter = await generateRejectionLetter(application);
        } else {
          return res.status(400).json({ error: "Invalid letter type" });
        }

        console.log(
          "Letter generated successfully, size:",
          letter.length,
          "bytes"
        );

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="${letterType}_letter_${applicationId}.pdf"`
        );
        res.setHeader("Content-Length", letter.length);
        res.setHeader("Cache-Control", "no-cache");

        return res.send(letter);
      } catch (letterError) {
        console.error("Error in letter generation:", letterError);
        console.error("Letter error stack:", letterError.stack);
        return res.status(500).json({
          error: "Failed to generate letter",
          details: letterError.message,
        });
      }
    } catch (error) {
      console.error("Error in generateLetter:", error);
      console.error("Error stack:", error.stack);
      return res.status(500).json({
        error: "Failed to generate letter",
        details: error.message,
      });
    }
  },
};

module.exports = meetingController;
