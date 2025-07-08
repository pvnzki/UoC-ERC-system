const express = require("express");
const officeStaffController = require("../controllers/office-staff-controller");

const router = express.Router();

// Office Staff endpoints
router.get("/applications/:id", officeStaffController.getApplicationDetails);
router.post(
  "/applications/:id/checked",
  officeStaffController.markApplicationChecked
);
router.post(
  "/applications/:id/outcome",
  officeStaffController.markApplicationOutcome
);
router.post(
  "/applications/:id/return-email",
  officeStaffController.sendReturnEmailToApplicant
);
router.get("/applications", officeStaffController.getAllApplications);
router.patch(
  "/applications/:id/set-status",
  officeStaffController.setApplicationStatus
);

module.exports = router;
