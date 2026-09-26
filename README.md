# 🚀 Campus2Career — Complete Full-Stack MERN Placement Preparation Platform

A production-ready Full-Stack MERN (MongoDB, Express, React, Node.js) web application designed for students and engineering candidates to systematically prepare for campus recruitment and transition smoothly from campus into corporate tech careers (Google, Microsoft, Amazon, TCS, Infosys, Wipro, Accenture).

---

## 🎨 Theme & UI/UX Design System
- **Pure Green & Emerald Gradient Palette**: Designed with glowing jade accents, dark forest slate canvas (`#050a07`, `#0c1611`), and crisp mint highlights.
- **Zero Blue Shades**: Strictly tailored to emerald and mint gradients.
- **Responsive Sidebar Architecture**: Collapsible sidebar layout with active indicators, stats chips, and mobile drawer.
- **Micro-Animations**: Animated streak flame, pulsating socket indicator, and festive confetti celebrations.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 6, React Router DOM v6, Axios, Lucide React Icons, Canvas Confetti
- **Analytics & Visualizations**: Custom Green Gradient interactive SVG charts (Topic Accuracy with 60% cutoff line, Practice Velocity Trend Curve, Placement Readiness Gauge)
- **Backend**: Node.js, Express.js (ES Modules), Morgan logger, CORS
- **Database**: MongoDB Atlas with Mongoose ODM (Cloud cluster)
- **Authentication**: JWT (JSON Web Tokens), Bcrypt.js (10 Salt Rounds), protected route guards
- **Real-Time Layer**: Socket.io Server & Client for live leaderboard sync and mock test timers

---

## 🌟 Core Features Implemented

### 1. 🔐 Authentication & Session Persistence
- Candidate Registration with real-time **Password Strength Meter** (Weak, Fair, Good, Strong) and celebratory confetti.
- Secure Login with 1-click **⚡ Instant Demo Autofill** (`candidate@test.com` / `password123`).
- JWT token expiration handling with Axios request/response interceptors.

### 2. 📊 Candidate Command Center (Dashboard)
- **GitHub-Style 52-Week Activity Heatmap**: Interactive activity calendar with 4 green intensity levels and hover tooltips showing daily problem counts.
- **Interactive Daily Goals**: Daily milestones with checkbox toggles awarding **+15 XP** upon completion.
- **Quick Weak-Area Radar**: Live diagnostic preview alerting candidates to topics below 60% accuracy.
- **Career Target Editor**: Modal to customize target company track (e.g. *TCS Digital*, *Google*, *Infosys SP*) and graduation year.

### 3. 💻 Practice Tracker (DSA, Aptitude, SQL, Reasoning)
- **Log Solved Problems**: Modal with title, category, topic, difficulty (Easy/Medium/Hard), time taken, outcome, and notes.
- **Automated XP Engine**: +10 XP for Easy, +20 XP for Medium, +35 XP for Hard questions.
- **Multi-Criteria Filtering & Search**: Instant filter by category, difficulty, or keyword.
- **Curated Problem Bank**: 1-click quick-log for company favorites (Two Sum, Coin Change DP, SQL Joins, Speed & Distance).

### 4. 📝 Mock Test System (TCS & Infosys Pattern)
- **Active Countdown Timer**: Sectional assessments with visual countdown (turns red in last 3 minutes and auto-submits on 00:00).
- **Negative Marking Support**: Standard company scoring (+2 marks for correct, -0.5 marks deduction for incorrect).
- **Section Tabs**: Navigate easily between Quantitative Aptitude, Logical Reasoning, and Technical Coding.
- **Instant Result Evaluation Report**: Score verdict (Passed / Needs Review), percentage, accuracy, and detailed question-by-question explanations.

### 5. 📈 Analytics & Weak-Area Diagnostic Engine
- **Automatic Weak Areas Detection**: Dynamically filters every topic with accuracy strictly below 60% and assigns actionable recommendations.
- **Topic Accuracy Chart**: Bar chart with a marked 60% passing cut-off line.
- **Practice Velocity Curve**: Area trend showing recent practice volume and time invested.
- **Readiness Score Index (0-100)**: Composite index based on volume solved, accuracy, streak, and mock test scores.

### 6. 🏆 Real-Time Leaderboard (Socket.io)
- **Podium Showcase**: Top 3 candidates with Gold (#1), Silver (#2), and Bronze (#3) podium cards.
- **Real-Time Broadcast**: Live socket.io event emits instantly whenever any candidate completes a challenge or test.
- **Candidate Spotlight**: Current user row is highlighted with a glowing green border and real-time rank.

---

## 📂 Project Architecture

```
d:/Mern_Project/
├── package.json                 # Root script runner (runs backend & frontend concurrently)
├── README.md                    # Setup and documentation
├── backend/
│   ├── .env                     # MongoDB Atlas credentials & JWT configuration
│   ├── .env.example             # Template configuration
│   ├── package.json             # Backend dependencies
│   ├── server.js                # Express & Socket.io server entrypoint
│   ├── seed.js                  # Database seed script for dummy users, tests & problems
│   ├── config/
│   │   └── db.js                # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, me & profile update
│   │   ├── practiceController.js # Practice logging, history, heatmap, daily goals
│   │   ├── testController.js    # Mock test timer, auto-evaluator & negative marking
│   │   ├── analyticsController.js # Topic accuracy & weak areas detection (<60%)
│   │   └── leaderboardController.js # Real-time ranking engine
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authorization guard
│   ├── models/
│   │   ├── User.js              # User schema with streak, points, goals, notifications
│   │   ├── Problem.js           # Curated problem schema
│   │   ├── UserProgress.js      # Solved problem history
│   │   ├── Test.js              # Mock test schema with sectional questions
│   │   └── Result.js            # Mock test evaluation results
│   └── routes/
│       ├── authRoutes.js
│       ├── practiceRoutes.js
│       ├── testRoutes.js
│       ├── analyticsRoutes.js
│       └── leaderboardRoutes.js
└── frontend/
    ├── index.html               # Main HTML with Campus2Career branding & fonts
    ├── package.json             # Frontend dependencies
    ├── vite.config.js           # Vite dev server with proxy to port 5000
    └── src/
        ├── main.jsx             # React entrypoint
        ├── App.jsx              # App layout with Sidebar, Topbar and protected routing
        ├── index.css            # Emerald & Green Gradient design system (Zero Blue)
        ├── components/
        │   ├── Sidebar.jsx      # Navigation sidebar with career role and logout
        │   ├── Topbar.jsx       # Real-time streak, XP counter, and notification alerts
        │   ├── ProtectedRoute.jsx # Route authentication guard
        │   └── AnalyticsCharts.jsx # Interactive Green Gradient SVG charts
        ├── context/
        │   └── AuthContext.jsx  # Global session state
        ├── pages/
        │   ├── Login.jsx        # Login page with demo autofill
        │   ├── Register.jsx     # Registration with password strength meter
        │   ├── Dashboard.jsx    # Candidate Hub (Heatmap, Goals, Metrics)
        │   ├── PracticeTracker.jsx # Problem history & filters
        │   ├── MockTests.jsx    # Timer-based mock test simulator
        │   ├── Analytics.jsx    # Weak areas diagnostic engine (<60%)
        │   └── Leaderboard.jsx  # Real-time Socket.io campus leaderboard
        └── services/
            ├── api.js           # Axios instance with interceptors
            └── socket.js        # Socket.io client wrapper
```

---

## ⚡ Quick Start Guide

### 1. Run Everything With One Command
From the root directory (`d:\Mern_Project`):
```bash
npm.cmd run dev
```
> Starts:
> - Backend API on: **`http://localhost:5000`**
> - Frontend Application on: **`http://localhost:5173`**

### 2. Instant Demo Credentials
- **URL**: https://placement-prep-tan.vercel.app/?_vercel_share=R9rFEaTU7h3iX1Rp0Jglv9o1BFHaqSV5
- Click **"⚡ Use Demo Account"** or enter:
  - **Email**: `candidate@test.com`
  - **Password**: `password123`
