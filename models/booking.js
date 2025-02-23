const mongoose = require('mongoose');

// Define the schema
const BookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    familyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, required: true },
    familyMembers: { type: Number, required: true },
    paymentConfirmed: { type: Boolean, default: false }, // Track payment confirmation
});

// Export the model Booking
module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
