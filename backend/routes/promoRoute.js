const express = require("express");
const Promo = require("../models/Promo");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");
const router = express.Router();

// ✅ Get All Promos
router.get("/api/promos", async (req, res) => {
    try {
        const promos = await Promo.find();
        res.json(promos);
    } catch (err) {
        console.error("Error fetching promos:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Create a New Promo
router.post("/api/promos", ensureAuthenticated, async (req, res) => {
    try {
        const { name, message, price } = req.body;

        // Validate required fields
        if (!name || !message || !price) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const promo = new Promo({ name, message, price });
        await promo.save();

        res.status(201).json({ message: "Promo created successfully", promo });
    } catch (err) {
        console.error("Error creating promo:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Update Promo
router.put("/api/promos/:id", ensureAuthenticated, async (req, res) => {
    try {
        const { name, message, price } = req.body;
        const updatedPromo = await Promo.findByIdAndUpdate(req.params.id, { name, message, price }, { new: true });

        if (!updatedPromo) return res.status(404).json({ error: "Promo not found" });

        res.json({ message: "Promo updated successfully", updatedPromo });
    } catch (err) {
        console.error("Error updating promo:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Delete Promo
router.delete("/api/promos/:id", ensureAuthenticated, async (req, res) => {
    try {
        const deletedPromo = await Promo.findByIdAndDelete(req.params.id);
        if (!deletedPromo) return res.status(404).json({ error: "Promo not found" });

        res.json({ message: "Promo deleted successfully" });
    } catch (err) {
        console.error("Error deleting promo:", err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
