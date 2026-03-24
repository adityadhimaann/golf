# ⛳ GolfCharity: Play. Win. Give.

**GolfCharity** is a premium golf-themed participation platform where players log their Stableford rounds for a chance to win monthly jackpots, with at least 10% of every subscription going directly to their chosen charities.

---

## 🌟 Key Features

### 👤 Member Dashboard
- **Score Logging**: Easily track your Stableford points and qualify for the monthly draw. Only your 5 most recent rounds are kept active for maximum fairness.
- **Charity Selection**: Choose your impact! Select from a directory of vetted charities and set your personalized donation percentage.
- **Winnings Tracker**: Real-time status of prize earnings, pending payouts, and proof verification.
- **Subscription Management**: Securely manage your membership level (Monthly or Pro) and impact levels.

### 🛡️ Admin Command Center
- **System Pulse**: Live activity logs for platform events (registrations, scores, subscriptions).
- **KPI Analytics**: Real-time business metrics including Active Subscribers, Prize Pool Growth, and Total Charity Impact.
- **User Management**: Unified dashboard to manage user status (Active/Suspended/Verified).
- **Winner Claims**: Streamlined process to verify winner handicaps and process payouts.
- **Charity Portal**: Register and manage supported non-profit organizations.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT (JSON Web Tokens) with secure HTTP headers.
- **Payments**: Stripe (Integrated for subscription lifecycle and webhooks).
- **Media**: Cloudinary (Secure storage for handicap proof and charity logos).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

### 3. Installation
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
# From root
npm install
npm run dev
```

---

## 🏗️ Architecture Design

- **The Giving Guarantee**: All subscription payments are automatically distributed based on the user's selected `charity_percentage`.
- **The Draw Algorithm**: Monthly winners are calculated using a rolling window of recent scores, ensuring consistent participation is rewarded.
- **Verification Loop**: Premium payouts require an official handicap screenshot, which is uploaded by the member and verified by an admin.

---

## 📜 License
This project is private and proprietary.
