const express = require('express');
const path = require('path');
const router = express.Router();

// Serve the winter.html file
router.get('/winter', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/winter.html'));
});

module.exports = router;
