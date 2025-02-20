const express = require("express");
const router = express.Router();
const authController = require("../controller/auth-controller");

router.post("/login", authController.validateUser);

router.get("/validate", authController.validateToken);

module.exports = router;
