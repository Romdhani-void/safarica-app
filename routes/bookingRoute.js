const express = require('express');
const router = express.Router();
const path = require('path');
const Booking = require('../models/booking'); 
const Promo = require('../models/Promo'); // Import the Promo model
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

// Serve the booking page
router.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/booking.html'));
});

// Handle "Book Now & Pay Later"
router.post('/book-later', async (req, res) => {
    const { name, familyName, email, phone, startDate, endDate, type, familyMembers } = req.body;

    try {
        const newBooking = new Booking({
            name,
            familyName,
            email,
            phone,
            startDate,
            endDate,
            type,
            familyMembers,
            paymentConfirmed: false,
        });

        await newBooking.save();
        res.status(200).json({ message: 'Booking saved successfully' });
    } catch (err) {
        console.error('Error saving booking:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Handle "Pay & Book Now" (Using Dynamic Promo Pricing)
router.post('/pay-now', async (req, res) => {
    const { name, familyName, email, phone, startDate, endDate, type, familyMembers } = req.body;

    try {
        // Get promo price for selected type (Summer or Winter)
        let promo = await Promo.findOne({ name: type });
        let pricePerNight = promo ? promo.price : 250; // Default to 250 if no promo found

        // Calculate total amount
        const days = Math.ceil(
            (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
        );
        const amount = days * familyMembers * pricePerNight * 100; // Convert to cents

        // Save booking as paid
        const newBooking = new Booking({
            name,
            familyName,
            email,
            phone,
            startDate,
            endDate,
            type,
            familyMembers,
            paymentConfirmed: true,
        });

        const savedBooking = await newBooking.save();

        // Create Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: { name: `Booking - ${type} Plan` },
                        unit_amount: amount,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get(
                'host'
            )}/checkout-result?status=success&id=${savedBooking._id}`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout-result?status=cancel`,
        });

        res.json({ sessionUrl: session.url });
    } catch (err) {
        console.error('Error processing payment:', err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// Handle Checkout Result
router.get('/checkout-result', async (req, res) => {
    const { status, id } = req.query;

    if (status === 'success') {
        res.redirect('/payment-success');
    } else {
        res.redirect('/payment-cancelled');
    }
});

// Success Page
router.get('/payment-success', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/success.html'));
});

// Cancellation Page
router.get('/payment-cancelled', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/cancel.html'));
});

module.exports = router;
