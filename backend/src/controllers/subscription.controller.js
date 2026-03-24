const stripeService = require('../services/stripe.service');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const CharityContribution = require('../models/CharityContribution');
const { sendResponse } = require('../utils/apiResponse');

exports.createCheckout = async (req, res) => {
  const { plan } = req.body;
  const user = req.user;

  let planId = plan === 'monthly' ? process.env.STRIPE_MONTHLY_PRICE_ID : process.env.STRIPE_YEARLY_PRICE_ID;

  // Use a dummy plan ID if missing (for demo/mock purposes)
  if (!planId && (!process.env.STRIPE_SECRET_KEY || process.env.NODE_ENV !== 'production')) {
    planId = 'price_mock_' + plan;
  }

  if (!planId) {
    return sendResponse(res, 400, 'Invalid subscription plan or missing Stripe price ID');
  }

  const customer = await stripeService.createOrRetrieveCustomer(user.email, user.full_name);
  
  if (!user.stripe_customer_id) {
    user.stripe_customer_id = customer.id;
    await user.save();
  }

  const session = await stripeService.stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['card'],
    line_items: [{ price: planId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/dashboard?status=success`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing?status=cancelled`,
    metadata: { userId: user._id.toString() }
  });

  // Mock activation for development
  if (process.env.NODE_ENV === 'development' || !process.env.STRIPE_SECRET_KEY) {
    await Subscription.findOneAndUpdate(
      { user_id: user._id },
      { 
        status: 'active', 
        plan: plan,
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
      },
      { upsert: true }
    );
  }

  return sendResponse(res, 200, 'Checkout session created', { url: session.url });
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (process.env.NODE_ENV === 'production') {
      event = stripeService.stripe.webhooks.constructEvent(
        req.body, 
        sig, 
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // In development/test mode, we skip signature verification for easy testing
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  const session = event.data.object;
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const userId = session.metadata.userId;
      const stripeSubId = session.subscription;
      const stripeCustId = session.customer;
      
      const subscription = await stripeService.stripe.subscriptions.retrieve(stripeSubId);
      
      await Subscription.findOneAndUpdate(
        { user_id: userId },
        {
          user_id: userId,
          plan: subscription.items.data[0].price.id === process.env.STRIPE_MONTHLY_PRICE_ID ? 'monthly' : 'yearly',
          status: 'active',
          stripe_subscription_id: stripeSubId,
          stripe_customer_id: stripeCustId,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000)
        },
        { upsert: true, new: true }
      );

      // Record contribution amount only if user has selected a charity
      const user = await User.findById(userId);
      if (user && user.charity_id) {
        const amount = session.amount_total / 100;
        const charityContribution = amount * (user.charity_percentage / 100);
        
        await CharityContribution.create({
          user_id: userId,
          charity_id: user.charity_id,
          amount: charityContribution,
          source: 'subscription'
        });
      }
      
      break;
    }
    
    case 'customer.subscription.updated': {
      const sub = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripe_subscription_id: sub.id },
        {
          status: sub.status === 'active' ? 'active' : 'inactive',
          current_period_end: new Date(sub.current_period_end * 1000)
        }
      );
      break;
    }
    
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripe_subscription_id: sub.id },
        { status: 'cancelled' }
      );
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await Subscription.findOneAndUpdate(
        { stripe_customer_id: invoice.customer },
        { status: 'lapsed' }
      );
      break;
    }
  }

  res.status(200).json({ received: true });
};

exports.getStatus = async (req, res) => {
  const subscription = await Subscription.findOne({ user_id: req.user._id });
  if (!subscription) {
    return sendResponse(res, 200, 'No subscription found', { status: 'none' });
  }
  return sendResponse(res, 200, 'Subscription status fetched', subscription);
};

exports.cancel = async (req, res) => {
  const subscription = await Subscription.findOne({ user_id: req.user._id, status: 'active' });
  if (!subscription) {
    return sendResponse(res, 400, 'No active subscription found to cancel');
  }

  await stripeService.cancelSubscription(subscription.stripe_subscription_id);
  subscription.status = 'cancelled';
  await subscription.save();

  return sendResponse(res, 200, 'Subscription cancelled successfully');
};
