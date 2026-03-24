export const MOCK_CHARITIES = [
  {
    id: '65f8a1a2b3c4d5e6f7000001',
    name: 'Golfers Against Cancer',
    description: 'Funding cancer research through national golf events.',
    logo: '/images/cancer-charity.png',
    featured: true,
    totalImpact: 1250000,
    category: 'Health',
  },
  {
    id: '65f8a1a2b3c4d5e6f7000002',
    name: 'Youth on Course',
    description: 'Providing youth with access to life-changing opportunities through golf.',
    logo: '/images/youth-charity.png',
    featured: true,
    totalImpact: 840000,
    category: 'Youth',
  },
  {
    id: '65f8a1a2b3c4d5e6f7000003',
    name: 'Fairways for Warriors',
    description: 'Providing golf instruction and equipment to combat wounded veterans.',
    logo: '/images/veteran-charity.png',
    featured: false,
    totalImpact: 450000,
    category: 'Veterans',
  }
];

export const MOCK_DRAWS = [
  {
    id: 'd1',
    month: 'March 2026',
    status: 'Upcoming',
    drawDate: '2026-03-31T20:00:00Z',
    jackpotPrize: 50000,
    charityPool: 25000,
  },
  {
    id: 'd2',
    month: 'February 2026',
    status: 'Completed',
    drawDate: '2026-02-28T20:00:00Z',
    winningScore: 36,
    jackpotPrize: 45000,
    charityPool: 22500,
    userMatch: '3-Match',
    userPrize: 150,
  }
];

export const MOCK_SCORES = [
  { id: 's1', date: '2026-03-10', score: 34, active: true },
  { id: 's2', date: '2026-03-05', score: 38, active: true },
  { id: 's3', date: '2026-02-20', score: 32, active: false },
  { id: 's4', date: '2026-02-15', score: 40, active: false },
  { id: 's5', date: '2026-01-30', score: 36, active: false },
];

export const MOCK_USER = {
  name: 'Alex Mercer',
  email: 'alex.mercer@example.com',
  subscriptionStatus: 'Active',
  plan: 'Yearly',
  renewalDate: '2027-01-15',
  selectedCharityId: '65f8a1a2b3c4d5e6f7000002',
  contributionPercentage: 15,
  totalContributed: 450,
  totalWinnings: 150,
  drawsEntered: 12
};

export const MOCK_STATS = {
  totalPrizePool: 2450000,
  totalCharityDonated: 1200000,
  activeMembers: 12450
};
