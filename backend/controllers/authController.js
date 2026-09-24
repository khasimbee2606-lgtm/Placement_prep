import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, college, targetCompany, graduationYear } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      college: college ? college.trim() : '',
      targetCompany: targetCompany ? targetCompany.trim() : 'Top Tech Companies',
      graduationYear: graduationYear ? Number(graduationYear) : 2026,
      streak: 1,
      points: 50, // 50 Welcome bonus points
      lastActiveDate: new Date(),
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Placement Preparation Tracker.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streak: user.streak,
        points: user.points,
        problemsSolved: user.problemsSolved,
        targetCompany: user.targetCompany,
        college: user.college,
        graduationYear: user.graduationYear,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Find user by email and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // Streak logic calculation
    const today = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;

    if (lastActive) {
      const diffTime = Math.abs(today.setHours(0, 0, 0, 0) - lastActive.setHours(0, 0, 0, 0));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        user.streak += 1;
        user.points += 10; // Streak bonus
      } else if (diffDays > 1) {
        // Missed days - reset to 1
        user.streak = 1;
      }
      // If diffDays === 0, same day login, retain streak
    } else {
      user.streak = 1;
    }

    user.lastActiveDate = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        streak: user.streak,
        points: user.points,
        problemsSolved: user.problemsSolved,
        targetCompany: user.targetCompany,
        college: user.college,
        graduationYear: user.graduationYear,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private (JWT required)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching profile',
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private (JWT required)
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { name, targetCompany, college, graduationYear } = req.body;

    if (name) user.name = name.trim();
    if (targetCompany) user.targetCompany = targetCompany.trim();
    if (college) user.college = college.trim();
    if (graduationYear) user.graduationYear = Number(graduationYear);

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating profile',
    });
  }
};
