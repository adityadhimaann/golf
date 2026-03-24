const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function testPassword() {
  await mongoose.connect(process.env.MONGODB_URI);
  const email = 'dhimanaditya56@gmail.com';
  const inputPass = 'password123'; // assuming this is what they use for testing
  
  const user = await User.findOne({ email }).select('+password');
  if (user) {
    console.log('User found:', user.email);
    console.log('Hashed pass in DB:', user.password);
    const matches = await bcrypt.compare(inputPass, user.password);
    console.log('Matches "password123":', matches);
  } else {
    console.log('User not found');
  }
  process.exit();
}

testPassword();
