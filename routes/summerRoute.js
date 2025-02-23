const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the summer.html file
router.get('/summer', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/summer.html'));
});

module.exports = router;
