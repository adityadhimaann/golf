const checkMatch = (drawnNumbers, userScoreSnapshot) => {
  const matched = drawnNumbers.filter(num => userScoreSnapshot.includes(num));
  return {
    matched_numbers: matched,
    match_count: matched.length
  };
};

module.exports = { checkMatch };
