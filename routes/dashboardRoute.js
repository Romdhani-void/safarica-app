const express = require("express");
const Booking = require("../models/booking"); // Import Booking model
const router = express.Router();

// Route to get dashboard statistics
router.get("/dashboard-stats", async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments(); // Count all bookings
        const confirmedBookings = await Booking.countDocuments({ paymentConfirmed: true }); // Count only confirmed ones

        res.json({ totalBookings, confirmedBookings });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
