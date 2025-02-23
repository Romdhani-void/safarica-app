const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the about.html file
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

module.exports = router;
