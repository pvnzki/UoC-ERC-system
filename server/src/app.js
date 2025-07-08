const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const cors = require("cors");
const express = require("express");
const db = require("./models"); // Sequelize models
const authRoutes = require("./routes/auth-routes");
const applicationRoutes = require("./routes/application-routes");
const authorizeRoles = require("./utils/auth-roles");
const adminRoutes = require("./routes/admin-routes");
const officeStaffRoutes = require("./routes/office-staff-routes");
const { isAuthenticated, isAdmin } = require("./middleware/auth-middleware");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://uoc-erc-system.onrender.com",
    ];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/applications", authorizeRoles("applicant"), applicationRoutes);
app.use("/api/office-staff", officeStaffRoutes);

// Public 2FA endpoints (must come before the protected admin routes)
app.post(
  "/api/admin/security/2fa/request",
  require("./controllers/admin-controller").request2FACode
);
app.post(
  "/api/admin/security/2fa/verify",
  require("./controllers/admin-controller").verify2FACode
);

// In development with BYPASS_AUTH, don't apply the middleware
if (
  process.env.NODE_ENV === "development" &&
  process.env.BYPASS_AUTH === "true"
) {
  app.use("/api/admin", adminRoutes);
} else {
  // In production, apply the middleware
  app.use("/api/admin", isAuthenticated, isAdmin, adminRoutes);
}

// Sync database
db.sequelize.sync().then(() => {
  console.log("Database synced!");
});

module.exports = app;
