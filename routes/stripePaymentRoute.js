const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

require('dotenv').config(); // Ensure environment variables are loaded

// Initialize Stripe with the secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY);

// Middleware to log requests (optional, for debugging)
router.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Route to create a Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    console.log('Request received at /create-checkout-session');
    console.log('Request Body:', req.body);

    const { amount, success_url, cancel_url } = req.body;

    // Validate input
    if (!amount || !success_url || !cancel_url) {
        return res.status(400).json({ error: 'Amount, success_url, and cancel_url are required.' });
    }

    // Ensure amount is a positive integer
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Booking Payment',
                        },
                        unit_amount: amount, // Amount in cents (e.g., 5000 = $50.00)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: success_url || 'http://localhost:5000/success',
            cancel_url: cancel_url || 'http://localhost:5000/cancel',
        });

        console.log('Checkout session created successfully:', session.id);

        res.json({ id: session.id }); // Send the session ID to the client
    } catch (error) {
        console.error('Error creating Stripe Checkout Session:', error.message);
        res.status(500).send('Error creating Stripe Checkout Session');
    }
});

module.exports = router;
