const Draw = require('../models/Draw');
const DrawEntry = require('../models/DrawEntry');
const Score = require('../models/Score');
const Subscription = require('../models/Subscription');
const PrizePool = require('../models/PrizePool');
const Winner = require('../models/Winner');
const { calculatePrizePool } = require('../utils/prizeCalculator');
const { generateRandomNumbers, generateAlgorithmicNumbers } = require('../utils/drawEngine');
const { checkMatch } = require('../utils/matchChecker');

exports.initializeDraw = async (month, drawDate, mode) => {
  // Get active subscribers count
  const activeSubs = await Subscription.countDocuments({ status: 'active' });
  
  // Find any carried jackpot from last published draw
  const lastDraw = await Draw.findOne({ status: 'published' }).sort({ draw_date: -1 });
  const jackpotCarriedAmount = lastDraw && lastDraw.jackpot_carried ? lastDraw.jackpot_amount : 0;

  // Create pending draw
  const draw = await Draw.create({
    month,
    draw_date: drawDate,
    mode,
    jackpot_amount: jackpotCarriedAmount,
    subscriber_count: activeSubs,
    status: 'pending'
  });

  // Calculate prize pool
  // Assuming average monthly fee of 15
  const avgFee = 15;
  const pools = calculatePrizePool(activeSubs, avgFee, jackpotCarriedAmount);
  
  await PrizePool.create({
    draw_id: draw._id,
    total_pool: pools.total_pool,
    tier_5_pool: pools.tier_5_pool,
    tier_4_pool: pools.tier_4_pool,
    tier_3_pool: pools.tier_3_pool,
    subscriber_count: activeSubs
  });

  // Snapshot active subscribers' scores
  const activeUserSubscriptions = await Subscription.find({ status: 'active' }).populate('user_id');
  
  for (const sub of activeUserSubscriptions) {
    const userScores = await Score.find({ user_id: sub.user_id._id }).sort({ date_played: -1 });
    const scoreArray = userScores.map(s => s.score);
    
    await DrawEntry.create({
      draw_id: draw._id,
      user_id: sub.user_id._id,
      scores_snapshot: scoreArray
    });
  }

  return draw;
};

exports.simulateDraw = async (id) => {
  const draw = await Draw.findById(id);
  if (!draw) throw new Error('Draw not found');
  
  const entries = await DrawEntry.find({ draw_id: id });
  
  let drawnNumbers;
  if (draw.mode === 'random') {
    drawnNumbers = generateRandomNumbers();
  } else {
    const allScores = entries.map(e => e.scores_snapshot);
    drawnNumbers = generateAlgorithmicNumbers(allScores);
  }

  // Run match logic on all entries
  for (const entry of entries) {
    const result = checkMatch(drawnNumbers, entry.scores_snapshot);
    entry.matched_numbers = result.matched_numbers;
    entry.match_count = result.match_count;
    await entry.save();
  }

  draw.drawn_numbers = drawnNumbers;
  draw.status = 'simulated';
  await draw.save();

  // Return preview results
  const tier5WinnersCount = await DrawEntry.countDocuments({ draw_id: id, match_count: 5 });
  const tier4WinnersCount = await DrawEntry.countDocuments({ draw_id: id, match_count: 4 });
  const tier3WinnersCount = await DrawEntry.countDocuments({ draw_id: id, match_count: 3 });

  return {
    draw_id: draw._id,
    drawn_numbers: drawnNumbers,
    counts: {
      tier_5: tier5WinnersCount,
      tier_4: tier4WinnersCount,
      tier_3: tier3WinnersCount
    }
  };
};

exports.publishDraw = async (id) => {
  const draw = await Draw.findById(id);
  const prizePool = await PrizePool.findOne({ draw_id: id });
  
  const winnersByTier = {
    5: await DrawEntry.find({ draw_id: id, match_count: 5 }),
    4: await DrawEntry.find({ draw_id: id, match_count: 4 }),
    3: await DrawEntry.find({ draw_id: id, match_count: 3 })
  };

  const createWinners = async (tier, tierEntries, poolAmount) => {
    if (tierEntries.length === 0) return 0;
    const perWinnerPrize = poolAmount / tierEntries.length;
    for (const entry of tierEntries) {
      await Winner.create({
        draw_id: id,
        user_id: entry.user_id,
        tier,
        prize_amount: perWinnerPrize
      });
    }
    return tierEntries.length;
  };

  await createWinners(5, winnersByTier[5], prizePool.tier_5_pool);
  await createWinners(4, winnersByTier[4], prizePool.tier_4_pool);
  await createWinners(3, winnersByTier[3], prizePool.tier_3_pool);

  // Check for jackpot rollover
  if (winnersByTier[5].length === 0) {
    draw.jackpot_carried = true;
    draw.jackpot_amount = prizePool.tier_5_pool;
  } else {
    draw.jackpot_carried = false;
    draw.jackpot_amount = 0;
  }

  draw.status = 'published';
  await draw.save();

  return winnersByTier;
};
