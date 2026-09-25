import UserProgress from '../models/UserProgress.js';
import Problem from '../models/Problem.js';
import User from '../models/User.js';

// @desc    Add a solved problem to user history
// @route   POST /api/practice
// @access  Private
export const addPracticeProblem = async (req, res) => {
  try {
    const { title, type, topic, difficulty, timeTaken, isCorrect, notes, platform, problemUrl } = req.body;

    if (!title || !topic || !timeTaken) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, topic, and time taken (in minutes).',
      });
    }

    // Create UserProgress record
    const progress = await UserProgress.create({
      userId: req.user._id,
      title: title.trim(),
      type: type || 'DSA',
      topic: topic.trim(),
      difficulty: difficulty || 'Medium',
      timeTaken: Number(timeTaken),
      isCorrect: isCorrect !== undefined ? Boolean(isCorrect) : true,
      notes: notes ? notes.trim() : '',
    });

    // Award XP based on difficulty & correctness
    let pointsAwarded = 5; // Base XP for practice effort
    if (progress.isCorrect) {
      if (progress.difficulty === 'Easy') pointsAwarded = 10;
      else if (progress.difficulty === 'Medium') pointsAwarded = 20;
      else if (progress.difficulty === 'Hard') pointsAwarded = 35;
    }

    const user = await User.findById(req.user._id);
    user.problemsSolved += 1;
    user.points += pointsAwarded;

    // Check streak
    const today = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) {
      const diffTime = Math.abs(today.setHours(0, 0, 0, 0) - lastActive.setHours(0, 0, 0, 0));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.streak += 1;
        user.points += 10; // Daily streak bonus
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.lastActiveDate = new Date();

    // Check if daily goals can be auto-completed
    if (user.dailyGoals && user.dailyGoals.length > 0) {
      user.dailyGoals.forEach((goal) => {
        if (!goal.completed && (goal.category === progress.type || goal.title.toLowerCase().includes(progress.topic.toLowerCase()))) {
          goal.completed = true;
        }
      });
    }

    await user.save();

    // Emit real-time leaderboard update via socket.io
    if (req.io) {
      req.io.emit('leaderboard_updated', {
        userId: user._id,
        userName: user.name,
        points: user.points,
        streak: user.streak,
      });
    }

    res.status(201).json({
      success: true,
      message: `Problem logged successfully! +${pointsAwarded} XP awarded.`,
      progress,
      user: {
        points: user.points,
        streak: user.streak,
        problemsSolved: user.problemsSolved,
      },
    });
  } catch (error) {
    console.error('Error adding practice problem:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error adding practice problem',
    });
  }
};

// @desc    Get user practice history with filters & search
// @route   GET /api/practice
// @access  Private
export const getPracticeHistory = async (req, res) => {
  try {
    const { topic, difficulty, type, search, sort = 'newest' } = req.query;

    const query = { userId: req.user._id };

    if (topic && topic !== 'All') {
      query.topic = { $regex: topic, $options: 'i' };
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (type && type !== 'All') {
      query.type = type;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOption = sort === 'oldest' ? { solvedAt: 1 } : { solvedAt: -1 };

    const history = await UserProgress.find(query).sort(sortOption).limit(100);

    // Compute quick metrics
    const totalSolved = history.length;
    const correctCount = history.filter((h) => h.isCorrect).length;
    const accuracy = totalSolved > 0 ? Math.round((correctCount / totalSolved) * 100) : 0;
    const totalTime = history.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0);

    res.status(200).json({
      success: true,
      count: totalSolved,
      accuracy,
      totalTime,
      history,
    });
  } catch (error) {
    console.error('Error fetching practice history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching practice history',
    });
  }
};

// @desc    Delete practice entry
// @route   DELETE /api/practice/:id
// @access  Private
export const deletePracticeProblem = async (req, res) => {
  try {
    const item = await UserProgress.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Practice entry not found or unauthorized',
      });
    }

    await item.deleteOne();

    // Decrement user count
    const user = await User.findById(req.user._id);
    if (user.problemsSolved > 0) user.problemsSolved -= 1;
    if (user.points >= 10) user.points -= 10;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Practice record deleted',
      user: {
        points: user.points,
        problemsSolved: user.problemsSolved,
      },
    });
  } catch (error) {
    console.error('Error deleting practice entry:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting entry',
    });
  }
};

// @desc    Get curated problem repository
// @route   GET /api/practice/curated
// @access  Private
export const getCuratedProblems = async (req, res) => {
  try {
    const { type, difficulty } = req.query;
    const query = {};
    if (type && type !== 'All') query.type = type;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    const problems = await Problem.find(query).limit(50);
    res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error('Error fetching curated problems:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching problems',
    });
  }
};

// @desc    Get activity heatmap data (like GitHub 365-day calendar)
// @route   GET /api/practice/heatmap
// @access  Private
export const getActivityHeatmap = async (req, res) => {
  try {
    const history = await UserProgress.find({ userId: req.user._id }).select('solvedAt isCorrect timeTaken');

    // Group by YYYY-MM-DD
    const heatmapMap = {};

    history.forEach((item) => {
      const dateStr = item.solvedAt.toISOString().split('T')[0];
      if (!heatmapMap[dateStr]) {
        heatmapMap[dateStr] = {
          date: dateStr,
          count: 0,
          correct: 0,
          totalTime: 0,
        };
      }
      heatmapMap[dateStr].count += 1;
      if (item.isCorrect) heatmapMap[dateStr].correct += 1;
      heatmapMap[dateStr].totalTime += item.timeTaken || 0;
    });

    const heatmap = Object.values(heatmapMap).sort((a, b) => a.date.localeCompare(b.date));

    res.status(200).json({
      success: true,
      heatmap,
    });
  } catch (error) {
    console.error('Error generating heatmap:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error generating heatmap',
    });
  }
};

// @desc    Daily Goals management
// @route   GET, POST, PUT, DELETE /api/practice/goals
// @access  Private
export const getDailyGoals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('dailyGoals');
    res.status(200).json({
      success: true,
      goals: user.dailyGoals || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addDailyGoal = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Goal title is required' });
    }

    const user = await User.findById(req.user._id);
    user.dailyGoals.push({
      title: title.trim(),
      category: category || 'DSA',
      completed: false,
    });
    await user.save();

    res.status(201).json({
      success: true,
      goals: user.dailyGoals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleDailyGoal = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const goal = user.dailyGoals.id(req.params.id);
    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    goal.completed = !goal.completed;
    if (goal.completed) {
      user.points += 15; // Bonus for finishing a goal!
    } else {
      if (user.points >= 15) user.points -= 15;
    }
    await user.save();

    res.status(200).json({
      success: true,
      goals: user.dailyGoals,
      points: user.points,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDailyGoal = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.dailyGoals = user.dailyGoals.filter((g) => g._id.toString() !== req.params.id);
    await user.save();

    res.status(200).json({
      success: true,
      goals: user.dailyGoals,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user notifications & streak alerts
// @route   GET /api/practice/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications streak lastActiveDate dailyGoals');

    // Auto-generate notifications if needed
    const notifications = [...(user.notifications || [])];

    // Check streak warning
    const today = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) {
      const diffTime = Math.abs(today.setHours(0, 0, 0, 0) - lastActive.setHours(0, 0, 0, 0));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays >= 1) {
        notifications.unshift({
          _id: 'streak-warning',
          title: '🔥 Streak Warning',
          message: 'Solve at least 1 problem or attempt a test today to maintain your ' + user.streak + '-day streak!',
          type: 'streak',
          read: false,
          createdAt: new Date(),
        });
      }
    }

    // Check uncompleted daily goals
    const uncompletedGoals = user.dailyGoals ? user.dailyGoals.filter((g) => !g.completed).length : 0;
    if (uncompletedGoals > 0) {
      notifications.unshift({
        _id: 'goal-alert',
        title: '🎯 Daily Goals Alert',
        message: `You have ${uncompletedGoals} pending goal(s) scheduled for today. Complete them to earn +15 XP each!`,
        type: 'goal',
        read: false,
        createdAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
