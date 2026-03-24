const calculatePrizePool = (subscriberCount, feePerMonth, carriedJackpot = 0) => {
  const totalPool = subscriberCount * feePerMonth * 0.30;
  
  return {
    total_pool: totalPool,
    tier_5_pool: (totalPool * 0.40) + carriedJackpot,
    tier_4_pool: (totalPool * 0.35),
    tier_3_pool: (totalPool * 0.25)
  };
};

module.exports = { calculatePrizePool };
