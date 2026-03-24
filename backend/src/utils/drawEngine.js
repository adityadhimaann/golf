const generateRandomNumbers = () => {
  const numbers = new Set();
  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

const generateAlgorithmicNumbers = (userScoresSnapshot) => {
  const frequency = {};
  for (let i = 1; i <= 45; i++) frequency[i] = 0;
  
  // Flat score arrays from all entries
  userScoresSnapshot.flat().forEach(score => {
    if (score >= 1 && score <= 45) {
      frequency[score]++;
    }
  });

  // Calculate weights based on frequency (higher frequency = higher weight)
  const weightedArr = [];
  Object.entries(frequency).forEach(([num, freq]) => {
    // Add number to weighted array (freq + 1 times)
    for (let i = 0; i <= freq; i++) {
      weightedArr.push(Number(num));
    }
  });

  const selected = new Set();
  while (selected.size < 5) {
    const randomIndex = Math.floor(Math.random() * weightedArr.length);
    selected.add(weightedArr[randomIndex]);
  }

  return Array.from(selected).sort((a, b) => a - b);
};

module.exports = { generateRandomNumbers, generateAlgorithmicNumbers };
