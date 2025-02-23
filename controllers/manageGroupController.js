const path = require('path');
const Admin = require('../models/Admin');

// ✅ Serve the main Manage My Group page
exports.listAdmins = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/manageMyGroup.html'));
};

// ✅ Serve the edit admin page
exports.editAdminPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/editAdmin.html'));
};

// ✅ API: Fetch all admins
exports.getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        console.error('Error fetching admins:', err);
        res.status(500).json({ error: 'Server error while fetching admins' });
    }
};

// ✅ API: Fetch a single admin by ID (for editing)
exports.getAdminById = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        console.error('Error fetching admin:', err);
        res.status(500).json({ error: 'Server error while fetching admin' });
    }
};

// ✅ Create a new admin
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newAdmin = new Admin({ name, email, password });
        await newAdmin.save();
        res.redirect('/manageMyGroup');
    } catch (err) {
        console.error('Error creating admin:', err);
        res.status(400).send('Error creating admin.');
    }
};

// ✅ Update admin details
exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(id, { name, email }, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.json(updatedAdmin);
    } catch (err) {
        console.error('Error updating admin:', err);
        res.status(500).json({ error: 'Server error while updating admin' });
    }
};

// ✅ Delete an admin (Prevent deletion if it's the last admin)
// ✅ Delete an admin (Prevent deletion if it's the last admin)
exports.deleteAdmin = async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();

        if (adminCount === 1) {
            // Redirect back with a friendly error message
            return res.redirect('/manageMyGroup?error=lastAdmin');
        }

        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
        if (!deletedAdmin) {
            return res.redirect('/manageMyGroup?error=notFound');
        }

        res.redirect('/manageMyGroup?success=deleted');
    } catch (err) {
        console.error('Error deleting admin:', err);
        res.redirect('/manageMyGroup?error=serverError');
    }
};

