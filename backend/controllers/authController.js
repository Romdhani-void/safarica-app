const path = require("path");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

// Render login page
exports.loginPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
};

// Handle login logic
exports.handleLogin = async (req, res) => {
  console.log("🟡 Request Body:", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log(`❌ Admin not found for email: ${email}`);
      return res.status(400).send("Admin not found");
    }

    console.log("🔹 Entered Password:", password);
    console.log("🔹 Stored Hash in DB:", admin.password);

    // Trim input and compare passwords
    const isMatch = await bcrypt.compare(password.trim(), admin.password.trim());
    console.log(`🔹 Password Match Result for ${email}:`, isMatch);

    if (isMatch) {
      console.log(`✅ Admin logged in successfully: ${admin.email}`);
      req.session.adminId = admin._id;
      return res.redirect("/dashboard");
    }

    console.log(`❌ Password mismatch for user: ${admin.email}`);
    return res.status(400).send("Invalid password");
  } catch (err) {
    console.error("❌ Error during login:", err);
    return res.status(500).send("Server error");
  }
};

// Render dashboard page
exports.dashboardPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dashboard.html"));
};

// Handle logout
exports.handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    console.log("✅ Session destroyed, redirecting to login");
    res.redirect("/login");
  });
};

// Default admin password is now hashed properly
exports.createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: "admin@safarica.com" });

    if (!existingAdmin) {
      const rawPassword = "password123"; // Make sure this is the raw password

      const defaultAdmin = new Admin({
        name: "Default Admin",
        email: "admin@safarica.com",
        password: rawPassword, //  Now storing the correctly hashed password
      });

      await defaultAdmin.save();
      console.log("✅ Default admin created successfully with properly hashed password.");
    } else {
      console.log("✅ Default admin already exists. Skipping creation.");
    }
  } catch (err) {
    console.error("❌ Error creating default admin:", err);
  }
};
