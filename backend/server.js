import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import testRoutes from './routes/testRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();
const server = http.createServer(app);

// Permissive and secure CORS origin validator for Vercel and Render deployments
const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  const configuredClients = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
    : [];
  const standardOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'https://localhost:5173',
    'https://placement-prep-tan.vercel.app',
    'https://placement-prep-myu8f6nap-sk-bala-khasim-bees-projects.vercel.app',
    'https://placement-prep-ku9x.onrender.com',
  ];

  if (standardOrigins.includes(origin) || configuredClients.includes(origin)) {
    return true;
  }
  // Allow any Vercel deployment preview or production domain
  if (origin.endsWith('.vercel.app') || origin.includes('vercel.app')) return true;
  // Allow any Render deployment domain
  if (origin.endsWith('.onrender.com') || origin.includes('onrender.com')) return true;

  return true;
};

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, isAllowedOrigin(origin) ? (origin || true) : true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 204,
};

// Socket.io initialization for real-time leaderboard and test timers
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin) ? (origin || true) : true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Test session heartbeat
  socket.on('join_test_room', (data) => {
    socket.join(`test_${data.testId}`);
    console.log(`[Socket.io] User ${data.userName} joined test room: test_${data.testId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Attach socket.io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Campus2Career API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    modules: ['Authentication', 'Practice Tracker', 'Mock Tests', 'Analytics Engine', 'Leaderboard', 'Socket.io'],
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Campus2Career API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found - ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Placement Tracker Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
