# 🚀 Placement Preparation Tracker (MERN Stack)

A complete, production-ready Full-Stack MERN application designed for engineering, MCA, and CS candidates to systematically prepare for campus placements (TCS, Infosys, Wipro, Accenture) and top product tech companies (Google, Microsoft, Amazon).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, React Router DOM v6, Axios, Lucide React, Canvas Confetti
- **Styling**: Modern Vanilla CSS Design System with dark mode, glassmorphism, responsive grid, and fluid micro-animations
- **Backend**: Node.js, Express.js (ES Modules)
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens), Bcrypt.js (10 Salt Rounds), HTTP-ready Bearer Authorization
- **Real-Time Layer**: Socket.io Server initialized for live leaderboard and mock test timers

---

## 📂 Project Architecture

```
d:/Mern_Project/
├── package.json                 # Root package.json (run both frontend & backend concurrently)
├── README.md                    # Setup and usage guide
├── backend/
│   ├── .env                     # MongoDB Atlas credentials & JWT configuration
│   ├── .env.example             # Template environment variables
│   ├── package.json             # Backend dependencies (Express, Mongoose, JWT, Bcrypt, Socket.io)
│   ├── server.js                # Express & Socket.io server entrypoint
│   ├── config/
│   │   └── db.js                # MongoDB Atlas connection with Mongoose
│   ├── controllers/
│   │   └── authController.js    # Register, Login, Me, Profile update logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & route protection
│   ├── models/
│   │   ├── User.js              # User schema (auth, streak, points, target company)
│   │   ├── Problem.js           # DSA / Aptitude / SQL problem schema
│   │   ├── UserProgress.js      # Solved problem history & time tracking
│   │   ├── Test.js              # Mock test system schema (TCS/Infosys pattern)
│   │   └── Result.js            # Mock test results & sectional analytics
│   └── routes/
│       └── authRoutes.js        # Auth REST endpoints
└── frontend/
    ├── index.html               # Main HTML with Outfit & Plus Jakarta Sans Google Fonts
    ├── package.json             # Frontend dependencies (React, Vite, Axios, Lucide)
    ├── vite.config.js           # Vite config with API proxying to backend (port 5000)
    └── src/
        ├── main.jsx             # React DOM root entrypoint
        ├── App.jsx              # Application router & protected routes
        ├── index.css            # Comprehensive Modern CSS Design System
        ├── components/
        │   ├── Navbar.jsx       # Real-time gamified header (Streak, Points XP, User Menu)
        │   └── ProtectedRoute.jsx # Guarded route wrapper for authenticated sessions
        ├── context/
        │   └── AuthContext.jsx  # Global React Context for Auth & User session state
        ├── pages/
        │   ├── Login.jsx        # Modern Login page with 1-click Demo autofill & validation
        │   ├── Register.jsx     # Registration with live password strength meter & confetti
        │   └── Dashboard.jsx    # Candidate Hub (Streak, XP, Readiness Score, Modules, Goals)
        └── services/
            └── api.js           # Axios instance with request/response interceptors
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+ or v24+)
- Active Internet connection for MongoDB Atlas

### 1. Run Everything With One Command (Recommended)
From the root workspace folder (`d:\Mern_Project`):
```bash
# If running in Windows PowerShell, use npm.cmd:
npm.cmd run dev
```
> This starts both:
> - Backend Server on: **`http://localhost:5000`**
> - Frontend Dev Server on: **`http://localhost:5173`**

---

### 2. Manual / Separate Terminal Setup

#### **A. Backend Setup**
```bash
cd backend
npm.cmd install
npm.cmd run dev   # or: node server.js
```
The backend will connect to MongoDB Atlas and display:
```
[MongoDB Connected] Host: ac-qbgcacg-shard-00-01.hqwhgwf.mongodb.net, Database: placement_tracker
🚀 Placement Tracker Server running on port 5000 in development mode
```

#### **B. Frontend Setup**
Open a second terminal window:
```bash
cd frontend
npm.cmd install
npm.cmd run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Account & MongoDB Credentials

### Pre-Configured Atlas Database:
The backend `.env` is already configured with your Atlas credentials:
```env
PORT=5000
MONGODB_URI=mongodb+srv://khasimbee2606_db_user:j9f6yy3vlh3hziNd@cluster0.hqwhgwf.mongodb.net/placement_tracker?retryWrites=true&w=majority
JWT_SECRET=super_secret_placement_tracker_jwt_key_2026_xyz!@#
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Instant Demo Login:
On the Login page (`http://localhost:5173/login`), click the **"⚡ Use Demo Account"** button or enter:
- **Email:** `candidate@test.com`
- **Password:** `password123`

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Backend health check & uptime | No |
| `POST` | `/api/auth/register` | Register new candidate | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated candidate profile | Yes (Bearer Token) |
| `PUT` | `/api/auth/profile` | Update candidate track, college, or year | Yes (Bearer Token) |

---

## 🎯 Key Features Implemented

1. **Secure JWT Authentication**:
   - Automatic password hashing via `bcryptjs` with 10 salt rounds.
   - JWT tokens generated with 7-day expiry.
   - Request interceptors in Axios automatically inject `Bearer <token>` on all requests.

2. **Gamification & Daily Streak Engine**:
   - Consecutive day login updates streak count (+1) and awards +10 XP bonus.
   - Missed activity automatically resets streak to 1 day.
   - Live animated streak flame in the Navbar and Dashboard.

3. **Interactive Registration & UI Polish**:
   - Live password strength meter with visual color gradation (Weak, Fair, Good, Strong).
   - Confetti blast celebration on successful registration.
   - 1-Click Demo autofill for rapid testing.
   - Show/Hide toggle on all password fields.
   - Profile quick-editor modal in Dashboard to adjust target company or graduation year.
