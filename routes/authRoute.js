const express = require('express');
const { loginPage, handleLogin, dashboardPage, handleLogout } = require('../controllers/authController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware'); // Middleware for route protection
const router = express.Router();

router.get('/login', loginPage); // Login page
router.post('/login', handleLogin); // Handle login
router.get('/dashboard', ensureAuthenticated, dashboardPage); // Protect dashboard route
router.get('/logout', handleLogout);

module.exports = router;
