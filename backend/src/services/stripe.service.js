const stripe = {
  checkout: {
    sessions: {
      create: async (params) => ({
        id: 'mock_session_' + Date.now(),
        url: params.success_url
      })
    }
  },
  customers: {
    list: async () => ({ data: [] }),
    create: async ({ email }) => ({ id: 'mock_cus_' + Date.now(), email })
  },
  subscriptions: {
    retrieve: async (id) => ({
      id,
      status: 'active',
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + 3600*24*30,
      items: {
        data: [{ price: { id: process.env.STRIPE_MONTHLY_PRICE_ID } }]
      }
    }),
    update: async (id) => ({ id, cancel_at_period_end: true })
  },
  webhooks: {
    constructEvent: (body, sig, secret) => {
      // Return a simulated event for testing
      return JSON.parse(body.toString());
    }
  }
};

const createCheckoutSession = async (customerId, email, planId) => {
  return await stripe.checkout.sessions.create({
    success_url: `${process.env.FRONTEND_URL}/dashboard?status=success`
  });
};

const createOrRetrieveCustomer = async (email, name) => {
  return await stripe.customers.create({ email, name });
};

const cancelSubscription = async (subscriptionId) => {
  return await stripe.subscriptions.update(subscriptionId);
};

module.exports = {
  stripe,
  createCheckoutSession,
  createOrRetrieveCustomer,
  cancelSubscription
};
