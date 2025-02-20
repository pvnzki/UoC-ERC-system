const jwt = require("jsonwebtoken");
const db = require("../models");

exports.validateToken = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // decode JWT token into token, secret_key, user_data & exp_time
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.validateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password is required" });
    }

    // const users = await db.User.findAll();
    const user = await db.User.findOne({
      where: { email: email, password: password },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    const userData = {
      user_code: user.email,
    };

    res
      .status(200)
      .json({ message: "User found.", auth: token, data: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      occupation,
      identity_number,
    } = req.body;

    if (!email || !password || !first_name || !last_name || !occupation) {
      return res.status(400).json({
        message:
          "Email, Password, First Name, Last Name & Occupation is required",
      });
    }

    const user = await db.User.create({
      email,
      password,
      first_name,
      last_name,
      phone,
      occupation,
      identity_number,
      created_at: Date.now(),
      role: "applicant",
    });

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    const userData = {
      user_code: user.email,
    };

    res
      .status(200)
      .json({ message: "User registered.", auth: token, data: userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Super admin endpoint to create admin users
exports.createAdminUser = async (req, res) => {
  try {
    // 1. First, verify that the requesting user is a super admin
    const requestingUserId = req.user.id; // Assuming you extract this from JWT in middleware
    const requestingUser = await db.User.findByPk(requestingUserId);

    if (!requestingUser || requestingUser.role !== "super_admin") {
      return res.status(403).json({
        message: "Unauthorized. Only super admins can create admin accounts.",
      });
    }

    // 2. Extract admin user data from request
    const { email, password, first_name, last_name, phone, role } = req.body;

    // 3. Validate required fields
    if (!email || !password || !first_name || !last_name || !role) {
      return res.status(400).json({
        message:
          "Email, Password, First Name, Last Name & Admin Role are required",
      });
    }

    // 4. Check if email already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // 5. Create the admin user
    const adminUser = await db.User.create({
      email,
      password, // Assuming you hash this password in a pre-save hook or before this point
      first_name,
      last_name,
      phone,
      role,
      created_at: Date.now(),
    });

    // 7. Return the created admin user (excluding sensitive data)
    const adminData = {
      id: adminUser.id,
      email: adminUser.email,
      first_name: adminUser.first_name,
      last_name: adminUser.last_name,
      role: adminUser.role,
    };

    // 8. Optionally trigger notification to the new admin
    // sendAdminWelcomeEmail(adminData.email, adminData.first_name);

    res.status(201).json({
      message: "Admin user created successfully",
      admin: adminData,
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ error: error.message });
  }
};
