require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('express-async-errors');

const { apiLimiter } = require('./middleware/rateLimiter.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

// Trust proxy for rate limiting on Render
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // For serving static images
}));

// CORS setup - ensure no whitespace from env split
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/$/, '')) 
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Stripe webhook requires raw body for signature verification
// This must be defined BEFORE express.json()
app.post('/api/subscriptions/webhook', express.raw({ type: 'application/json' }), require('./controllers/subscription.controller').handleWebhook);

// Body parser
app.use(express.json());

// Apply rate limiting to all requests
app.use(apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
const charityRoutes = require('./routes/charity.routes');
const userRoutes = require('./routes/user.routes');
const scoreRoutes = require('./routes/score.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const drawRoutes = require('./routes/draw.routes');
const winnerRoutes = require('./routes/winner.routes');
const reportRoutes = require('./routes/report.routes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/draws', drawRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/reports', reportRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
