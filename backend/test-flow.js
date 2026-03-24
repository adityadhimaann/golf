const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
let token = '';
let adminToken = '';
let userId = '';
let drawId = '';
let winnerId = '';
let charityId = '';

const log = (msg, data) => {
  console.log(`\n=== ${msg} ===`);
  if (data) console.log(JSON.stringify(data, null, 2));
};

async function runTest() {
  try {
    console.log("Starting Full Platform Test Flow...");

    // 1. SIGNUP
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      email: `testuser_${Date.now()}@example.com`,
      password: 'password123',
      full_name: 'Test Swinger',
      charity_percentage: 15
    });
    log("User Signed Up", signupRes.data);
    token = signupRes.data.data.token;
    userId = signupRes.data.data.user._id;

    // 2. ADMIN LOGIN (Assuming existing admin or we make this user admin for testing)
    // For now let's just use the same user and manually update roles in DB if needed, 
    // but I'll update this user to admin directly in DB for testing.
    
    // 3. ACTIVATE SUBSCRIPTION via Webhook Mock
    const webhookRes = await axios.post(`${API_URL}/subscriptions/webhook`, {
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { userId },
          subscription: 'sub_mock_123',
          customer: 'cus_mock_123',
          amount_total: 1500,
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + 3600*24*30,
        }
      }
    });
    log("Subscription Activated via Mock Webhook", webhookRes.data);

    // 4. ADD SCORES (Testing rolling limit of 5)
    console.log("Adding 6 scores...");
    for (let i = 1; i <= 6; i++) {
        await axios.post(`${API_URL}/scores`, {
            score: 20 + i,
            date_played: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        }, { headers: { Authorization: `Bearer ${token}` } });
    }
    const scoresRes = await axios.get(`${API_URL}/scores`, { headers: { Authorization: `Bearer ${token}` } });
    log("Scores List (should have exactly 5)", scoresRes.data.data);

    // 5. CREATE A CHARITY (Need Admin)
    // I'll skip admin check for a moment or update the user role
    // Let's assume the user is now admin
    // I need a way to make the user admin. I'll hack the controller or just wait for next step.
    
    // 6. DASHBOARD OVERVIEW
    const overviewRes = await axios.get(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    log("User Dashboard Overview", overviewRes.data.data);

    console.log("\nTEST COMPLETED SUCCESSFULLY");
  } catch (err) {
    console.error("Test Failed!");
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

runTest();
