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
        include: [{ model: require("../models").Applicant, as: "applicant" }],
      });
      if (!application || !application.applicant) {
        return res
          .status(404)
          .json({ error: "Applicant not found for this application" });
      }
      const { first_name, last_name, email } = application.applicant;
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

module.exports = officeStaffController;
module.exports.setApplicationStatus = setApplicationStatus;
