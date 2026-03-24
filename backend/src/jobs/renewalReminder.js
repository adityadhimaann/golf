const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { sendEmail } = require('../services/email.service');

const scheduleRenewalReminders = () => {
  // Run daily at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily renewal reminder job...');
    
    // Find active subscriptions ending in 3 days
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    // Period spanning that day
    const startOfDay = new Date(threeDaysFromNow.setHours(0, 0, 0, 0));
    const endOfDay = new Date(threeDaysFromNow.setHours(23, 59, 59, 999));

    const subscriptions = await Subscription.find({
      status: 'active',
      current_period_end: { $gte: startOfDay, $lte: endOfDay }
    }).populate('user_id');

    for (const sub of subscriptions) {
      if (sub.user_id && sub.user_id.email) {
        await sendEmail(
          sub.user_id.email,
          'Your Golf Charity Subscription Renewal',
          `<h1>Upcoming Renewal</h1><p>Hi ${sub.user_id.full_name}, your subscription will renew in 3 days on ${sub.current_period_end.toDateString()}. Thank you for your continued support!</p>`
        );
      }
    }
    
    console.log(`Sent renewal reminders to ${subscriptions.length} users.`);
  });
};

module.exports = scheduleRenewalReminders;
