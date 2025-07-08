// server/src/controllers/office-staff-controller.js
const { Application, Document, Payment, User } = require("../models");

const officeStaffController = {
  // 1. Get application details (including documents and payment slip)
  async getApplicationDetails(req, res) {
    try {
      const { id } = req.params;
      const application = await Application.findOne({
        where: { application_id: id },
        include: [
          {
            model: require("../models").Applicant,
            as: "applicant",
            attributes: [
              "applicant_id",
              "applicant_category",
              // No first_name, last_name, email here
            ],
            include: [
              {
                model: require("../models").User,
                as: "user",
                attributes: ["first_name", "last_name", "email", "user_id"],
              },
            ],
          },
          {
            model: require("../models").Document,
            as: "documents",
            attributes: [
              "document_id",
              "document_type",
              "file_path",
              "upload_date",
              "is_mandatory",
            ],
          },
          {
            model: require("../models").Payment,
            as: "payment",
            attributes: [
              "payment_id",
              "amount",
              "payment_status",
              "payment_evidence",
              "payment_date",
            ],
          },
        ],
      });
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mark application as checked
  async markApplicationChecked(req, res) {
    try {
      const { id } = req.params;
      const application = await Application.findOne({
        where: { application_id: id },
      });
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      application.status = "DOCUMENT_CHECK";
      application.last_updated = new Date();
      await application.save();
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 3. Mark outcome (forward/return)
  async markApplicationOutcome(req, res) {
    try {
      const { id } = req.params;
      const { outcome } = req.body; // outcome: 'forward' or 'return'
      const application = await Application.findOne({
        where: { application_id: id },
      });
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      if (outcome === "forward") {
        application.status = "PRELIMINARY_REVIEW";
      } else if (outcome === "return") {
        application.status = "RETURNED_FOR_RESUBMISSION";
      } else {
        return res.status(400).json({ error: "Invalid outcome value" });
      }
      application.last_updated = new Date();
      await application.save();

      // Send email to applicant when forwarded
      if (outcome === "forward") {
        const appWithApplicant = await Application.findOne({
          where: { application_id: id },
          include: [
            {
              model: require("../models").Applicant,
              as: "applicant",
              include: [
                {
                  model: require("../models").User,
                  as: "user",
                  attributes: ["first_name", "last_name", "email"],
                },
              ],
            },
          ],
        });
        if (
          appWithApplicant &&
          appWithApplicant.applicant &&
          appWithApplicant.applicant.user
        ) {
          const { first_name, last_name, email } =
            appWithApplicant.applicant.user;
          const staffName = req.user
            ? `${req.user.first_name} ${req.user.last_name}`
            : "ERC Office Staff";
          const subject = "Your ERC Application Has Been Forwarded for Review";
          const html = `<p>Dear ${first_name} ${last_name},</p>
            <p>Your application (ID: ${id}) has been forwarded to the ERC Technical Committee for further review.</p>
            <p>If you have any questions, please contact us.</p>
            <p>Best regards,<br/>${staffName}</p>`;
          await require("../utils/email-service").sendMail({
            to: email,
            subject,
            html,
            from: {
              name: staffName,
              address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            },
          });

          // Send application details to all ERC Technical Admins (role: 'ADMIN')
          const { User } = require("../models");
          const technicalAdmins = await User.findAll({
            where: { role: "ADMIN", validity: true },
            attributes: ["first_name", "last_name", "email"],
          });

          const appDetails = `
            <h3>New Application Forwarded</h3>
            <p><strong>Application ID:</strong> ${id}</p>
            <p><strong>Applicant:</strong> ${first_name} ${last_name} (${email})</p>
            <p><strong>Status:</strong> PRELIMINARY_REVIEW</p>
            <!-- Add more details as needed -->
          `;

          for (const admin of technicalAdmins) {
            if (admin.email) {
              await require("../utils/email-service").sendMail({
                to: admin.email,
                subject: "New Application Forwarded to ERC Technical Committee",
                html: appDetails,
                from: {
                  name: staffName,
                  address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                },
              });
            }
          }
        }
      }

      res.json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // 4. Send email to applicant with reasons for return
  async sendReturnEmailToApplicant(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        return res.status(400).json({ error: "Reason is required" });
      }
      const application = await Application.findOne({
        where: { application_id: id },
        include: [
          {
            model: require("../models").Applicant,
            as: "applicant",
            include: [
              {
                model: require("../models").User,
                as: "user",
                attributes: ["first_name", "last_name", "email"],
              },
            ],
          },
        ],
      });
      if (
        !application ||
        !application.applicant ||
        !application.applicant.user
      ) {
        return res
          .status(404)
          .json({ error: "Applicant user not found for this application" });
      }
      const { first_name, last_name, email } = application.applicant.user;
      const subject = "Your ERC Application Has Been Returned for Resubmission";
      const html = `<p>Dear ${first_name} ${last_name},</p>
        <p>Your application (ID: ${id}) has been returned for resubmission for the following reason:</p>
        <blockquote style='color: #b71c1c; border-left: 4px solid #b71c1c; padding-left: 12px;'>${reason}</blockquote>
        <p>Please address the above and resubmit your application at your earliest convenience.</p>
        <p>Best regards,<br/>ERC Office Staff</p>`;
      await require("../utils/email-service").sendMail({
        to: email,
        subject,
        html,
      });
      res.json({ message: "Return email sent to applicant." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get all applications for Office Staff
  async getAllApplications(req, res) {
    try {
      const applications = await Application.findAll({
        include: [
          {
            model: require("../models").Applicant,
            as: "applicant",
            attributes: [
              "applicant_id",
              "applicant_category",
              // No first_name, last_name, email here
            ],
            include: [
              {
                model: require("../models").User,
                as: "user",
                attributes: ["first_name", "last_name", "email", "user_id"],
              },
            ],
          },
        ],
        order: [["application_id", "DESC"]],
      });
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

// Temporary endpoint for testing: set the status of any application by ID
const setApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const application = await Application.findOne({
      where: { application_id: id },
    });
    if (!application) {
      return res.status(404).json({ error: `Application ${id} not found` });
    }
    application.status = status;
    application.last_updated = new Date();
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Office Staff Dashboard: Stats
async function getDashboardStats(req, res) {
  try {
    const { Application } = require("../models");
    const total = await Application.count();
    const pending = await Application.count({ where: { status: "SUBMITTED" } });
    const checked = await Application.count({
      where: { status: "DOCUMENT_CHECK" },
    });
    const returned = await Application.count({
      where: { status: "RETURNED_FOR_RESUBMISSION" },
    });
    const forwarded = await Application.count({
      where: { status: "PRELIMINARY_REVIEW" },
    });
    const approved = await Application.count({ where: { status: "APPROVED" } });
    res.json({ total, pending, checked, returned, forwarded, approved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Office Staff Dashboard: Recent Activities
async function getRecentActivities(req, res) {
  try {
    const { Application } = require("../models");
    const limit = parseInt(req.query.limit) || 10;
    const activities = await Application.findAll({
      order: [["last_updated", "DESC"]],
      limit,
      attributes: [
        "application_id",
        "status",
        "last_updated",
        "research_type",
        "application_type",
      ],
      include: [
        {
          model: require("../models").Applicant,
          as: "applicant",
          include: [
            {
              model: require("../models").User,
              as: "user",
              attributes: ["first_name", "last_name", "email"],
            },
          ],
        },
      ],
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = officeStaffController;
module.exports.setApplicationStatus = setApplicationStatus;
module.exports.getDashboardStats = getDashboardStats;
module.exports.getRecentActivities = getRecentActivities;
