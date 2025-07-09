const express = require("express");
const adminController = require("../controllers/admin-controller");
const adminReviewController = require("../controllers/admin-review-controller");
const meetingController = require("../controllers/meeting-controller");
const committeeInteractionController = require("../controllers/committee-interaction-controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth-middleware");

const router = express.Router();

// 2FA endpoints for admin (public, before auth middleware)
router.post("/security/2fa/request", adminController.request2FACode); // { email }
router.post("/security/2fa/verify", adminController.verify2FACode); // { email, code }

// Apply authentication and admin role check middleware to all routes
router.use(isAuthenticated, isAdmin);

// Account Management Routes (3.1.x)
router.post("/users", adminController.createUser); //(committee member, staff, or admin)
router.get("/users", adminController.listUsers);
router.delete("/users/:userId", adminController.deleteUser); // router.get("/committees/reviewers", adminController.listCommitteeReviewers); //no idea about reviewer
router.patch("/users/status", adminController.updateUserStatus); //update the status of a user(validity of the user)
router.post("/committees", adminController.createCommittee); //create a new committee
router.get("/committees", adminController.listCommittees); //take thelist of committees
router.get("/committees/details", adminController.listCommitteeReviewers); //get committees with members
router.post("/committees/members", adminController.addMembersToCommittee); //add members to a committee
router.delete(
  "/committees/members",
  adminController.removeMembersFromCommittee
); //remove members from a committee (Not from the system)
router.delete("/committees/:committeeId", adminController.deleteCommittee); //delete a committee
router.get("/debug/committees", adminController.debugCommittees); //debug committees endpoint
router.get("/debug/committee-members", adminController.debugCommitteeMembers); //debug committee members
router.get("/test/database", adminController.testDatabase); //test database connection

router.get("/table-structure/:tableName", adminController.getTableStructure); //get the structure of a table
// router.post("/update-schema", adminController.updateDatabaseSchema);

// Preliminary Review Routes (3.2.x)
router.get("/check-applications-table", adminController.checkApplicationsTable); //check the structure of the applications table
router.get("/check-applicant-table", adminController.checkApplicantTable); //check the structure of the applicants table
router.get("/check-models", adminController.checkModels); //checking the associations between the tables
router.get("/applications", adminReviewController.getApplications); //Done
router.get(
  "/applications/:applicationId",
  adminReviewController.getApplicationById
); // NEW: get single application
router.put(
  "/applications/:applicationId/review",
  adminReviewController.reviewApplication
); //can successfully review applications (can set the statuses : "RETURN_FOR_RESUBMISSION", "EXPEDITED_APPROVAL", "ASSIGN_COMMITTEE")
router.post(
  "/applications/:applicationId/email",
  adminReviewController.sendApplicantApprovalEmail
); //Approval email only sent when application is approved

// Committee Meeting Routes (3.3.x)
router.get("/meetings", meetingController.getMeetings);
router.post("/meetings", meetingController.createMeeting); //meetings are creating wrt the committee_id
router.put("/meetings/:meetingId/ratify", meetingController.ratifyDecisions);
router.get("/meetings/summary", meetingController.generateMeetingSummary); //meeting summary generated with meeting id, committee id , decisioins made and etc
router.get(
  "/applications/:applicationId/letter",
  meetingController.generateLetter
); //automatically generates and downloads the approval/rejection letters

// Committee Interaction Routes (3.4.x)
router.put(
  "/applications/:applicationId/assign",
  committeeInteractionController.assignToCommittee
); //successfully assigning applications to committees
router.put(
  "/applications/:applicationId/outcome",
  committeeInteractionController.reviewCommitteeOutcome
); //properly printing the outcome of ratifiedDecisions
router.post(
  "/committees/:committeeId/email",
  committeeInteractionController.sendCommitteeEmail
); //sending emails to committee chair by erc admin
router.post(
  "/applications/:applicationId/email-applicant",
  committeeInteractionController.sendApplicantEmail
); //sending emails to applicants by erc admin directly(not by the system)

// Dashboard Statistics Routes (3.5.x)
router.get("/dashboard/stats", adminController.getDashboardStats); //get dashboard statistics
router.get("/dashboard/activities", adminController.getRecentActivities); //get recent activities
router.get("/dashboard/test", adminController.testDashboard); //test dashboard functionality

//get analytics data
router.get("/analytics", adminController.getAnalyticsData);

// 2FA endpoints for admin
router.post("/security/2fa/enable", adminController.set2FA); // { enable: true/false }
// router.post("/security/2fa/request", adminController.request2FACode); // { email }
// router.post("/security/2fa/verify", adminController.verify2FACode); // { email, code }

// TEMP: List all users and their is_2fa_enabled status for debugging
router.get("/debug/users-2fa-status", adminController.listUsers2FAStatus);

module.exports = router;
