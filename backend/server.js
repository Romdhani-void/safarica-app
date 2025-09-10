const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Admin = require("./models/Admin");
const bookingRoute = require("./routes/bookingRoute");
const manageCustomerRoute = require("./routes/manageCustomerRoute");
const stripePaymentRoute = require("./routes/stripePaymentRoute");
const summerRoute = require("./routes/summerRoute");
const winterRoute = require("./routes/winterRoute");
const aboutRoute = require("./routes/aboutUsRoute");
const homeRoute = require("./routes/homeRoute");
const contactRoute = require("./routes/contactRoute");
const promoRoute = require("./routes/promoRoute");
const adminRoutes = require("./routes/adminRoutes");
const { createDefaultAdmin } = require("./controllers/authController");
const dashboardRoutes = require("./routes/dashboardRoute");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "8RD1ONhWw226VgLQjU5TOmZit14wRe5s",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", dashboardRoutes);
app.use("/", adminRoutes);
app.use("/", bookingRoute);
app.use("/", manageCustomerRoute);
app.use("/", summerRoute);
app.use("/", winterRoute);
app.use("/", aboutRoute);
app.use("/", homeRoute);
app.use("/", contactRoute);
app.use("/", promoRoute);
app.use("/api/stripe", stripePaymentRoute);
app.use("/", require("./routes/authRoute"));
app.use("/manageMyGroup", require("./routes/manageGroupRoute"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await createDefaultAdmin();
    } else {
      console.log("✅ Admin already exists. Skipping creation.");
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
