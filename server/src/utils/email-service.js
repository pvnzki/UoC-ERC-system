const nodemailer = require("nodemailer");
require("dotenv").config();

// Default to Gmail SMTP if EMAIL_HOST is not set
const emailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
const emailPort = process.env.EMAIL_PORT
  ? parseInt(process.env.EMAIL_PORT)
  : 587;
const emailSecure = process.env.EMAIL_SECURE
  ? process.env.EMAIL_SECURE === "true"
  : false; // false for port 587

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
  },
  // Add DKIM if you have keys (recommended for production)
  dkim: process.env.DKIM_PRIVATE_KEY
    ? {
        domainName: process.env.EMAIL_DOMAIN,
        keySelector: "default",
        privateKey: process.env.DKIM_PRIVATE_KEY,
      }
    : undefined,
});

// Send email function
const sendMail = async (options) => {
  try {
    const mailOptions = {
      from: {
        name: process.env.EMAIL_FROM_NAME || "ERC Admin",
        address: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      },
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html || "",
      // Add headers to improve deliverability
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "High",
        "List-Unsubscribe": process.env.EMAIL_DOMAIN
          ? `<mailto:unsubscribe@${process.env.EMAIL_DOMAIN}?subject=Unsubscribe>`
          : undefined,
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

// Generate personalized, professional HTML and subject for user creation emails
function buildUserWelcomeEmail({
  firstName,
  lastName,
  email,
  password,
  role,
  committeeId,
}) {
  let roleDisplay = "";
  let extraDetails = "";
  let subject = "Welcome to the UoC Ethics Review Committee System";
  if (role === "ADMIN") {
    roleDisplay = "Administrator";
    extraDetails = `<p style="margin: 5px 0;"><strong>Role:</strong> System Administrator (You have access to manage users, committees, and system settings.)</p>`;
    subject = "Your ERC System Admin Account";
  } else if (role === "COMMITTEE_MEMBER") {
    roleDisplay = "Committee Member";
    extraDetails = `<p style="margin: 5px 0;"><strong>Role:</strong> Committee Member (You can review and evaluate applications assigned to your committee.)</p>`;
    if (committeeId) {
      extraDetails += `<p style="margin: 5px 0;"><strong>Committee ID:</strong> ${committeeId}</p>`;
    }
    subject = "Your ERC Committee Member Account";
  } else if (role === "OFFICE_STAFF") {
    roleDisplay = "Office Staff";
    extraDetails = `<p style="margin: 5px 0;"><strong>Role:</strong> Office Staff (You can process and manage applications in the system.)</p>`;
    subject = "Your ERC Office Staff Account";
  } else {
    roleDisplay = role;
  }

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafd; border-radius: 12px; border: 1px solid #e0e6ed; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://www.cmb.ac.lk/wp-content/themes/university/images/logo.png" alt="University of Colombo Logo" style="max-width: 120px; margin-bottom: 8px;">
        <h2 style="color: #003366; margin: 0;">Ethics Review Committee System</h2>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #e0e6ed;">
        <h3 style="color: #0066cc; margin-top: 0;">Welcome, ${firstName} ${lastName}!</h3>
        <p style="font-size: 16px; color: #333;">Your account has been created as a <strong>${roleDisplay}</strong> in the University of Colombo ERC System.</p>
        <div style="background: #f1f7fb; padding: 16px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${password}</p>
          ${extraDetails}
        </div>
        <p style="font-size: 15px; color: #333;">Please log in at <a href="https://erc.cmb.ac.lk/login" style="color: #0066cc;">https://erc.cmb.ac.lk/login</a> and change your password immediately for security reasons.</p>
        <p style="font-size: 15px; color: #333;">If you have any questions or need assistance, please contact our support team at <a href="mailto:support@cmb.ac.lk" style="color: #0066cc;">support@cmb.ac.lk</a>.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e6ed; font-size: 13px; color: #888;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>If you did not request this account, please contact us immediately.</p>
        </div>
      </div>
    </div>
    `;

  const text = `Welcome to the University of Colombo ERC System. Your account has been created. Email: ${email}, Temporary Password: ${password}, Role: ${roleDisplay}`;
  return { subject, html, text };
}

// Generate email notification for user account deletion
function buildUserDeletionEmail({ firstName, lastName, email, role }) {
  const roleDisplay =
    role === "ADMIN"
      ? "Administrator"
      : role === "COMMITTEE_MEMBER"
        ? "Committee Member"
        : role === "OFFICE_STAFF"
          ? "Office Staff"
          : role;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafd; border-radius: 12px; border: 1px solid #e0e6ed; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://www.cmb.ac.lk/wp-content/themes/university/images/logo.png" alt="University of Colombo Logo" style="max-width: 120px; margin-bottom: 8px;">
        <h2 style="color: #003366; margin: 0;">Ethics Review Committee System</h2>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #e0e6ed;">
        <h3 style="color: #dc3545; margin-top: 0;">Account Deletion Notice</h3>
        <p style="font-size: 16px; color: #333;">Dear ${firstName} ${lastName},</p>
        <p style="font-size: 16px; color: #333;">Your account as a <strong>${roleDisplay}</strong> in the University of Colombo ERC System has been permanently deleted.</p>
        <div style="background: #fff3cd; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 5px 0; color: #856404;"><strong>Account Details:</strong></p>
          <p style="margin: 5px 0; color: #856404;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0; color: #856404;"><strong>Role:</strong> ${roleDisplay}</p>
          <p style="margin: 5px 0; color: #856404;"><strong>Deletion Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p style="font-size: 15px; color: #333;">You will no longer have access to the ERC system. If you believe this was done in error, please contact our support team immediately.</p>
        <p style="font-size: 15px; color: #333;">For any questions, please contact us at <a href="mailto:support@cmb.ac.lk" style="color: #0066cc;">support@cmb.ac.lk</a>.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e6ed; font-size: 13px; color: #888;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </div>
    `;

  const text = `Your ERC System account has been deleted. Email: ${email}, Role: ${roleDisplay}, Deletion Date: ${new Date().toLocaleDateString()}`;
  return {
    subject: "Your ERC System Account Has Been Deleted",
    html,
    text,
  };
}

// Generate email notification for committee membership addition
function buildCommitteeAdditionEmail({
  firstName,
  lastName,
  email,
  committeeName,
  committeeType,
  role,
}) {
  const roleDisplay =
    role === "MEMBER"
      ? "Committee Member"
      : role === "OFFICE_STAFF"
        ? "Office Staff"
        : role;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafd; border-radius: 12px; border: 1px solid #e0e6ed; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://www.cmb.ac.lk/wp-content/themes/university/images/logo.png" alt="University of Colombo Logo" style="max-width: 120px; margin-bottom: 8px;">
        <h2 style="color: #003366; margin: 0;">Ethics Review Committee System</h2>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #e0e6ed;">
        <h3 style="color: #28a745; margin-top: 0;">Committee Assignment Notice</h3>
        <p style="font-size: 16px; color: #333;">Dear ${firstName} ${lastName},</p>
        <p style="font-size: 16px; color: #333;">You have been assigned to a committee in the University of Colombo ERC System.</p>
        <div style="background: #d4edda; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #28a745;">
          <p style="margin: 5px 0; color: #155724;"><strong>Committee Details:</strong></p>
          <p style="margin: 5px 0; color: #155724;"><strong>Committee Name:</strong> ${committeeName}</p>
          <p style="margin: 5px 0; color: #155724;"><strong>Committee Type:</strong> ${committeeType}</p>
          <p style="margin: 5px 0; color: #155724;"><strong>Your Role:</strong> ${roleDisplay}</p>
          <p style="margin: 5px 0; color: #155724;"><strong>Assignment Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p style="font-size: 15px; color: #333;">You can now access committee-specific features and review applications assigned to this committee.</p>
        <p style="font-size: 15px; color: #333;">Log in at <a href="https://erc.cmb.ac.lk/login" style="color: #0066cc;">https://erc.cmb.ac.lk/login</a> to access your committee dashboard.</p>
        <p style="font-size: 15px; color: #333;">For any questions, please contact us at <a href="mailto:support@cmb.ac.lk" style="color: #0066cc;">support@cmb.ac.lk</a>.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e6ed; font-size: 13px; color: #888;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </div>
    `;

  const text = `You have been assigned to committee: ${committeeName} (${committeeType}) as ${roleDisplay}. Assignment Date: ${new Date().toLocaleDateString()}`;
  return {
    subject: `Committee Assignment: ${committeeName}`,
    html,
    text,
  };
}

// Generate email notification for committee membership removal
function buildCommitteeRemovalEmail({
  firstName,
  lastName,
  email,
  committeeName,
  committeeType,
  role,
}) {
  const roleDisplay =
    role === "MEMBER"
      ? "Committee Member"
      : role === "OFFICE_STAFF"
        ? "Office Staff"
        : role;

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafd; border-radius: 12px; border: 1px solid #e0e6ed; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://www.cmb.ac.lk/wp-content/themes/university/images/logo.png" alt="University of Colombo Logo" style="max-width: 120px; margin-bottom: 8px;">
        <h2 style="color: #003366; margin: 0;">Ethics Review Committee System</h2>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #e0e6ed;">
        <h3 style="color: #dc3545; margin-top: 0;">Committee Removal Notice</h3>
        <p style="font-size: 16px; color: #333;">Dear ${firstName} ${lastName},</p>
        <p style="font-size: 16px; color: #333;">You have been removed from a committee in the University of Colombo ERC System.</p>
        <div style="background: #f8d7da; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <p style="margin: 5px 0; color: #721c24;"><strong>Committee Details:</strong></p>
          <p style="margin: 5px 0; color: #721c24;"><strong>Committee Name:</strong> ${committeeName}</p>
          <p style="margin: 5px 0; color: #721c24;"><strong>Committee Type:</strong> ${committeeType}</p>
          <p style="margin: 5px 0; color: #721c24;"><strong>Your Previous Role:</strong> ${roleDisplay}</p>
          <p style="margin: 5px 0; color: #721c24;"><strong>Removal Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        <p style="font-size: 15px; color: #333;">You will no longer have access to committee-specific features for this committee.</p>
        <p style="font-size: 15px; color: #333;">If you believe this was done in error, please contact our support team immediately.</p>
        <p style="font-size: 15px; color: #333;">For any questions, please contact us at <a href="mailto:support@cmb.ac.lk" style="color: #0066cc;">support@cmb.ac.lk</a>.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e6ed; font-size: 13px; color: #888;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </div>
    `;

  const text = `You have been removed from committee: ${committeeName} (${committeeType}) as ${roleDisplay}. Removal Date: ${new Date().toLocaleDateString()}`;
  return {
    subject: `Committee Removal: ${committeeName}`,
    html,
    text,
  };
}

// Generate email notification for user status update
function buildUserStatusUpdateEmail({
  firstName,
  lastName,
  email,
  role,
  newStatus,
  reason,
}) {
  const roleDisplay =
    role === "ADMIN"
      ? "Administrator"
      : role === "COMMITTEE_MEMBER"
        ? "Committee Member"
        : role === "OFFICE_STAFF"
          ? "Office Staff"
          : role;

  const statusColor = newStatus ? "#28a745" : "#dc3545";
  const statusBg = newStatus ? "#d4edda" : "#f8d7da";
  const statusBorder = newStatus ? "#28a745" : "#dc3545";
  const statusTextColor = newStatus ? "#155724" : "#721c24";
  const statusText = newStatus ? "Activated" : "Deactivated";

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f8fafd; border-radius: 12px; border: 1px solid #e0e6ed; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://www.cmb.ac.lk/wp-content/themes/university/images/logo.png" alt="University of Colombo Logo" style="max-width: 120px; margin-bottom: 8px;">
        <h2 style="color: #003366; margin: 0;">Ethics Review Committee System</h2>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #e0e6ed;">
        <h3 style="color: ${statusColor}; margin-top: 0;">Account Status Update</h3>
        <p style="font-size: 16px; color: #333;">Dear ${firstName} ${lastName},</p>
        <p style="font-size: 16px; color: #333;">Your account status in the University of Colombo ERC System has been updated.</p>
        <div style="background: ${statusBg}; padding: 16px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${statusBorder};">
          <p style="margin: 5px 0; color: ${statusTextColor};"><strong>Account Details:</strong></p>
          <p style="margin: 5px 0; color: ${statusTextColor};"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0; color: ${statusTextColor};"><strong>Role:</strong> ${roleDisplay}</p>
          <p style="margin: 5px 0; color: ${statusTextColor};"><strong>New Status:</strong> ${statusText}</p>
          <p style="margin: 5px 0; color: ${statusTextColor};"><strong>Update Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${reason ? `<p style="margin: 5px 0; color: ${statusTextColor};"><strong>Reason:</strong> ${reason}</p>` : ""}
        </div>
        ${
          newStatus
            ? `<p style="font-size: 15px; color: #333;">Your account is now active. You can log in at <a href="https://erc.cmb.ac.lk/login" style="color: #0066cc;">https://erc.cmb.ac.lk/login</a>.</p>`
            : `<p style="font-size: 15px; color: #333;">Your account has been deactivated. You will no longer be able to access the system.</p>`
        }
        <p style="font-size: 15px; color: #333;">For any questions, please contact us at <a href="mailto:support@cmb.ac.lk" style="color: #0066cc;">support@cmb.ac.lk</a>.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e0e6ed; font-size: 13px; color: #888;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </div>
    `;

  const text = `Your ERC System account status has been updated. Email: ${email}, Role: ${roleDisplay}, New Status: ${statusText}, Update Date: ${new Date().toLocaleDateString()}`;
  return {
    subject: `Account Status Update: ${statusText}`,
    html,
    text,
  };
}

module.exports = {
  sendMail,
  buildUserWelcomeEmail,
  buildUserDeletionEmail,
  buildCommitteeAdditionEmail,
  buildCommitteeRemovalEmail,
  buildUserStatusUpdateEmail,
};
