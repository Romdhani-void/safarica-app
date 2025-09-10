const express = require('express');
const { listAdmins, createAdmin, deleteAdmin, getAdmins } = require('../controllers/manageGroupController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();

// ✅ Route to serve the admin management page
router.get('/', ensureAuthenticated, listAdmins);

// ✅ Fetch all admins (for frontend)
router.get('/api/admins', ensureAuthenticated, getAdmins);

// ✅ Create a new admin
router.post('/add', ensureAuthenticated, createAdmin);

// ✅ Delete an admin (Prevent deletion of the last admin)
router.post('/delete/:id', ensureAuthenticated, deleteAdmin);

module.exports = router;
