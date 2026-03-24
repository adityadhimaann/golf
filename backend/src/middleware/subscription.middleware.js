const Subscription = require('../models/Subscription');

const checkSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ 
      user_id: req.user._id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required to perform this action'
      });
    }

    req.subscription = subscription;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = checkSubscription;
