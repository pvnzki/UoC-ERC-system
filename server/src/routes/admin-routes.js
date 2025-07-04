const express = require("express");
const adminController = require("../controllers/admin-controller");
const adminReviewController = require("../controllers/admin-review-controller");
const meetingController = require("../controllers/meeting-controller");
const committeeInteractionController = require("../controllers/committee-interaction-controller");
const { isAuthenticated, isAdmin } = require("../middleware/auth-middleware");

const router = express.Router();

// Apply authentication and admin role check middleware to all routes
router.use(isAuthenticated, isAdmin);

// Account Management Routes (3.1.x)
router.post("/users", adminController.createUser); //(committee member, staff, or admin)
router.get("/users", adminController.listUsers);
router.delete("/users/:userId", adminController.deleteUser);
// router.get("/committees/reviewers", adminController.listCommitteeReviewers); //no idea about reviewer
router.patch("/users/status", adminController.updateUserStatus); //update the status of a user(validity of the user)
router.post("/committees", adminController.createCommittee); //create a new committee
router.get("/committees", adminController.listCommittees); //take thelist of committees
router.post("/committees/members", adminController.addMembersToCommittee); //add members to a committee
router.delete(
  "/committees/members",
  adminController.removeMembersFromCommittee
); //remove members from a committee (Not from the system)

router.get("/table-structure/:tableName", adminController.getTableStructure); //get the structure of a table
// router.post("/update-schema", adminController.updateDatabaseSchema);

// Preliminary Review Routes (3.2.x)
router.get("/check-applications-table", adminController.checkApplicationsTable); //check the structure of the applications table
router.get("/check-applicant-table", adminController.checkApplicantTable); //check the structure of the applicants table
router.get("/check-models", adminController.checkModels); //checking the associations between the tables
router.get("/applications", adminReviewController.getApplications); //Done
router.put(
  "/applications/:applicationId/review",
  adminReviewController.reviewApplication
);
router.post(
  "/applications/:applicationId/email",
  adminReviewController.sendApplicantEmail
);

// Committee Meeting Routes (3.3.x)
router.post("/meetings", meetingController.createMeeting);
router.put("/meetings/:meetingId/ratify", meetingController.ratifyDecisions);
router.get("/meetings/summary", meetingController.generateMeetingSummary);
router.get(
  "/applications/:applicationId/letter",
  meetingController.generateLetter
);

// Committee Interaction Routes (3.4.x)
router.put(
  "/applications/:applicationId/assign",
  committeeInteractionController.assignToCommittee
);
router.put(
  "/applications/:applicationId/outcome",
  committeeInteractionController.reviewCommitteeOutcome
);
router.post(
  "/committees/:committeeId/email",
  committeeInteractionController.sendCommitteeEmail
);
router.post(
  "/applications/:applicationId/email-applicant",
  committeeInteractionController.sendApplicantEmail
);

// TEMPORARY: Add missing columns to Applications table
router.post(
  "/add-missing-application-columns",
  adminController.addMissingApplicationColumns
);
// TEMPORARY: Add all missing columns to Applications table
router.post(
  "/add-all-missing-application-columns",
  adminController.addAllMissingApplicationColumns
);

module.exports = router;
