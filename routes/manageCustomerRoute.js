const express = require('express');
const path = require('path');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const router = express.Router();
const Booking = require('../models/booking');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

// ✅ Serve the Manage My Customer page
router.get('/manageMyCustomer', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/manageMyCustomer.html'));
});

// ✅ Serve the Edit Booking page
router.get('/editBooking', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/editBooking.html'));
});

// ✅ API: Fetch all bookings (supports search, filter, sorting)
router.get('/api/bookings', ensureAuthenticated, async (req, res) => {
    try {
        const filter = buildFilter(req.query);
        const sortQuery = buildSortQuery(req.query.sortBy);

        const bookings = await Booking.find(filter).sort(sortQuery);
        res.json(bookings);
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).json({ error: 'Server error while fetching bookings' });
    }
});

// ✅ API: Fetch a single booking by ID
router.get('/api/bookings/:id', ensureAuthenticated, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        res.json(booking);
    } catch (err) {
        console.error('Error fetching booking:', err);
        res.status(500).json({ error: 'Error fetching booking details' });
    }
});

// ✅ API: Update a booking
router.put('/api/bookings/:id', ensureAuthenticated, async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(updatedBooking);
    } catch (err) {
        console.error('Error updating booking:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ API: Confirm Payment
router.post('/api/confirm-payment/:id', ensureAuthenticated, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { paymentConfirmed: true },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ message: 'Payment confirmed successfully!', booking });
    } catch (err) {
        console.error('Error confirming payment:', err);
        res.status(500).json({ error: 'Error confirming payment.' });
    }
});

// ✅ API: Delete a booking
router.delete('/api/bookings/:id', ensureAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'Booking ID is required' });
        }

        const deletedBooking = await Booking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error('Error deleting booking:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ API: Export filtered bookings as CSV
router.get('/api/export/csv', ensureAuthenticated, async (req, res) => {
    try {
        const filter = buildFilter(req.query);
        const sortQuery = buildSortQuery(req.query.sortBy);

        const bookings = await Booking.find(filter).sort(sortQuery);
        if (!bookings.length) return res.status(404).json({ error: "No bookings found to export" });

        const fields = ['name', 'familyName', 'email', 'phone', 'startDate', 'endDate', 'type', 'familyMembers', 'paymentConfirmed'];
        const parser = new Parser({ fields });
        const csv = parser.parse(bookings);

        res.setHeader('Content-Disposition', 'attachment; filename=filtered-bookings.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.status(200).send(csv);
    } catch (err) {
        console.error('Error exporting CSV:', err);
        res.status(500).json({ error: 'Error exporting CSV' });
    }
});

// ✅ API: Export filtered bookings as PDF
router.get('/api/export/pdf', ensureAuthenticated, async (req, res) => {
    try {
        const filter = buildFilter(req.query);
        const sortQuery = buildSortQuery(req.query.sortBy);

        const bookings = await Booking.find(filter).sort(sortQuery);
        if (!bookings.length) return res.status(404).json({ error: "No bookings found to export" });

        const doc = new PDFDocument();
        res.setHeader('Content-Disposition', 'attachment; filename=filtered-bookings.pdf');
        res.setHeader('Content-Type', 'application/pdf');

        doc.pipe(res);
        doc.fontSize(16).text('Filtered Bookings Report', { align: 'center' }).moveDown(2);

        bookings.forEach((booking, index) => {
            doc.fontSize(12).text(`Booking ${index + 1}`, { underline: true });
            doc.text(`Name: ${booking.name}`);
            doc.text(`Family Name: ${booking.familyName}`);
            doc.text(`Email: ${booking.email}`);
            doc.text(`Phone: ${booking.phone}`);
            doc.text(`Start Date: ${new Date(booking.startDate).toLocaleDateString()}`);
            doc.text(`End Date: ${new Date(booking.endDate).toLocaleDateString()}`);
            doc.text(`Type: ${booking.type}`);
            doc.text(`Family Members: ${booking.familyMembers}`);
            doc.text(`Payment Confirmed: ${booking.paymentConfirmed ? 'Yes' : 'No'}`);
            doc.moveDown();
        });

        doc.end();
    } catch (err) {
        console.error('Error exporting PDF:', err);
        res.status(500).json({ error: 'Error exporting PDF' });
    }
});

// ✅ Utility function: Build filters based on request parameters
function buildFilter(query) {
    let filter = {};

    if (query.search) {
        filter.$or = [
            { name: { $regex: query.search, $options: "i" } },
            { email: { $regex: query.search, $options: "i" } },
            { phone: { $regex: query.search, $options: "i" } }
        ];
    }

    if (query.type) filter.type = query.type;
    if (query.payment === "true") filter.paymentConfirmed = true;
    if (query.payment === "false") filter.paymentConfirmed = false;

    return filter;
}

// ✅ Utility function: Build sorting queries
function buildSortQuery(sortBy) {
    let sortQuery = {};
    if (sortBy) {
        if (sortBy === "startDate-asc") sortQuery = { startDate: 1 };
        if (sortBy === "startDate-desc") sortQuery = { startDate: -1 };
        if (sortBy === "endDate-asc") sortQuery = { endDate: 1 };
        if (sortBy === "endDate-desc") sortQuery = { endDate: -1 };
    }
    return sortQuery;
}

module.exports = router;
