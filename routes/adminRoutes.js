const express = require("express");
const path = require("path");
const router = express.Router();

// Route to Serve Manage Promos Page
router.get("/managePromos", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/managePromos.html"));
});

module.exports = router;
