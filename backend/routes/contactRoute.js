const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the contact.html file
router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/contact.html'));
});

module.exports = router;
