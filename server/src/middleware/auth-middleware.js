const jwt = require("jsonwebtoken");
const { User, Admin } = require("../models");
require("dotenv").config();

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({
          error:
            "Authentication required: Please provide a Bearer token in the Authorization header.",
        });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user || !user.validity) {
      return res.status(401).json({ error: "User not found or inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const admin = await Admin.findOne({ where: { user_id: req.user.user_id } });

    if (!admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin authorization error:", error);
    return res.status(500).json({ error: "Authorization check failed" });
  }
};

module.exports = { isAuthenticated, isAdmin };
