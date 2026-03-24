const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscription.controller');
const auth = require('../middleware/auth.middleware');

// Public route - handled by middleware in app.js
// router.post('/webhook', subscriptionController.handleWebhook);

// Subscriber routes
router.post('/create-checkout', auth, subscriptionController.createCheckout);
router.get('/status', auth, subscriptionController.getStatus);
router.post('/cancel', auth, subscriptionController.cancel);

module.exports = router;
