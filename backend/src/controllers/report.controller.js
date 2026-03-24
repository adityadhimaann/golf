const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Winner = require('../models/Winner');
const CharityContribution = require('../models/CharityContribution');
const Draw = require('../models/Draw');
const PrizePool = require('../models/PrizePool');
const { sendResponse } = require('../utils/apiResponse');

exports.getOverview = async (req, res) => {
  const startOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const startOfLastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);

  // Current Stats (total count)
  const totalUsers = await User.countDocuments();
  const activeSubscribers = await Subscription.countDocuments({ status: 'active' });
  
  // Growth Comparison (Last Month vs Current)
  const lastMonthUsers = await User.countDocuments({ created_at: { $lt: startOfCurrentMonth } });
  const userGrowth = lastMonthUsers > 0 ? (((totalUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1) : "0";

  const lastMonthSubs = await Subscription.countDocuments({ status: 'active', created_at: { $lt: startOfCurrentMonth } });
  const subGrowth = lastMonthSubs > 0 ? (((activeSubscribers - lastMonthSubs) / lastMonthSubs) * 100).toFixed(1) : "0";

  const totalPrizeDistributed = await Winner.aggregate([
    { $match: { payout_status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$prize_amount' } } }
  ]);

  const totalCharityContributed = await CharityContribution.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  const drawsRun = await Draw.countDocuments({ status: 'published' });
  const currentDraw = await Draw.findOne({ status: 'pending' });
  const currentJackpot = currentDraw ? currentDraw.jackpot_amount : 0;

  return sendResponse(res, 200, 'Report overview fetched', {
    total_users: totalUsers,
    active_subscribers: activeSubscribers,
    total_prize_distributed: totalPrizeDistributed[0] ? totalPrizeDistributed[0].total : 0,
    total_charity_contributed: totalCharityContributed[0] ? totalCharityContributed[0].total : 0,
    draws_run: drawsRun,
    current_jackpot: currentJackpot,
    growth: {
      users: `${userGrowth >= 0 ? '+' : ''}${userGrowth}%`,
      subscribers: `${subGrowth >= 0 ? '+' : ''}${subGrowth}%`,
      prize: "+5.2%", // Mocking complex financial growth for now
      charity: "+12.4%"
    }
  });
};

exports.getSubscribersOverTime = async (req, res) => {
  const subscribers = await Subscription.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$created_at" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $project: { month: "$_id", count: 1, _id: 0 } }
  ]);
  
  return sendResponse(res, 200, 'Subscribers over time fetched', subscribers);
};

exports.getPrizesOverTime = async (req, res) => {
  const prizes = await PrizePool.aggregate([
    {
      $lookup: {
        from: 'draws',
        localField: 'draw_id',
        foreignField: '_id',
        as: 'draw'
      }
    },
    { $unwind: '$draw' },
    { $match: { 'draw.status': 'published' } },
    {
      $project: {
        month: '$draw.month',
        total_pool: 1,
        _id: 0
      }
    }
  ]);
  
  return sendResponse(res, 200, 'Prize pools over time fetched', prizes);
};

exports.getCharityContributions = async (req, res) => {
  const contributions = await CharityContribution.aggregate([
    {
      $group: {
        _id: '$charity_id',
        total: { $sum: '$amount' }
      }
    },
    {
      $lookup: {
        from: 'charities',
        localField: '_id',
        foreignField: '_id',
        as: 'charity'
      }
    },
    { $unwind: '$charity' },
    {
      $project: {
        charity: '$charity.name',
        total: 1,
        _id: 0
      }
    }
  ]);
  
  return sendResponse(res, 200, 'Charity contributions fetched', contributions);
};

exports.getDrawStatistics = async (req, res) => {
  const draws = await Draw.find({ status: 'published' }).sort({ draw_date: -1 });
  const stats = await Promise.all(draws.map(async (draw) => {
    const prizes = await Winner.aggregate([
      { $match: { draw_id: draw._id } },
      { $group: { _id: '$tier', count: { $sum: 1 }, total: { $sum: '$prize_amount' } } }
    ]);

    const prizeData = {};
    prizes.forEach(p => {
      prizeData[`tier_${p._id}_winners`] = p.count;
    });

    return {
      month: draw.month,
      total_entries: draw.subscriber_count,
      tier_5_winners: prizeData.tier_5_winners || 0,
      tier_4_winners: prizeData.tier_4_winners || 0,
      tier_3_winners: prizeData.tier_3_winners || 0,
      total_distributed: prizes.reduce((acc, curr) => acc + curr.total, 0)
    };
  }));
  return sendResponse(res, 200, 'Draw statistics fetched', stats);
};

exports.getRecentActivity = async (req, res) => {
  const [scores, subs, contributions] = await Promise.all([
    require('../models/Score').find().sort({ created_at: -1 }).limit(5).populate('user_id'),
    Subscription.find().sort({ created_at: -1 }).limit(5).populate('user_id'),
    CharityContribution.find().sort({ created_at: -1 }).limit(5).populate('user_id')
  ]);

  const activities = [
    ...scores.map(s => ({ id: `s-${s._id}`, type: 'score', user: s.user_id?.full_name || 'User', action: `logged a score of ${s.score}`, time: s.created_at })),
    ...subs.map(s => ({ id: `sub-${s._id}`, type: 'subscription', user: s.user_id?.full_name || 'User', action: `updated subscription to active`, time: s.created_at })),
    ...contributions.map(c => ({ id: `c-${c._id}`, type: 'charity', user: c.user_id?.full_name || 'User', action: `contributed $${c.amount}`, time: c.created_at }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

  return sendResponse(res, 200, 'Recent activity fetched', activities);
};
