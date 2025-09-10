exports.ensureAuthenticated = (req, res, next) => {
    console.log('Session:', req.session);
    if (req.session && req.session.adminId) {
        console.log(`Admin authenticated: ${req.session.adminId}`);
        return next();
    }
    console.log('Unauthorized access attempt detected. Redirecting to login.');
    res.redirect('/login'); // Redirect to login page if not authenticated
};
