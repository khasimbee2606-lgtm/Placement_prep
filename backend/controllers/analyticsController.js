import UserProgress from '../models/UserProgress.js';
import Result from '../models/Result.js';
import User from '../models/User.js';

// @desc    Calculate comprehensive analytics & detect weak areas (<60% accuracy)
// @route   GET /api/analytics
// @access  Private
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user progress and results
    const [progressList, resultList, user] = await Promise.all([
      UserProgress.find({ userId }).sort({ solvedAt: 1 }),
      Result.find({ userId }).sort({ createdAt: 1 }),
      User.findById(userId).select('streak points problemsSolved name college targetCompany'),
    ]);

    const totalProblems = progressList.length;
    const totalCorrect = progressList.filter((p) => p.isCorrect).length;
    const overallAccuracy = totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0;

    const totalTimeSpent = progressList.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0);
    const avgTimePerQuestion = totalProblems > 0 ? Math.round((totalTimeSpent / totalProblems) * 10) / 10 : 0;

    // 1. Topic-wise Accuracy & Weak Areas Detection (< 60% accuracy)
    const topicMap = {};
    progressList.forEach((item) => {
      const topicName = item.topic.trim();
      if (!topicMap[topicName]) {
        topicMap[topicName] = {
          topic: topicName,
          category: item.type || 'DSA',
          total: 0,
          correct: 0,
          totalTime: 0,
        };
      }
      topicMap[topicName].total += 1;
      if (item.isCorrect) topicMap[topicName].correct += 1;
      topicMap[topicName].totalTime += item.timeTaken || 0;
    });

    const topicAccuracyList = Object.values(topicMap).map((t) => {
      const accuracy = Math.round((t.correct / t.total) * 100);
      const avgTime = Math.round((t.totalTime / t.total) * 10) / 10;
      return {
        topic: t.topic,
        category: t.category,
        total: t.total,
        correct: t.correct,
        accuracy,
        avgTime,
        isWeak: accuracy < 60,
      };
    });

    // Identified weak areas (< 60% accuracy)
    const weakAreas = topicAccuracyList
      .filter((t) => t.isWeak)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map((w) => ({
        ...w,
        priority: w.accuracy < 40 ? 'High' : 'Medium',
        recommendation: `Recommended: Practice at least 5 ${w.topic} questions this week to push accuracy above 60%.`,
      }));

    // 2. Difficulty Breakdown
    const difficultyMap = { Easy: { count: 0, correct: 0, time: 0 }, Medium: { count: 0, correct: 0, time: 0 }, Hard: { count: 0, correct: 0, time: 0 } };
    progressList.forEach((p) => {
      const diff = p.difficulty || 'Medium';
      if (difficultyMap[diff]) {
        difficultyMap[diff].count += 1;
        if (p.isCorrect) difficultyMap[diff].correct += 1;
        difficultyMap[diff].time += p.timeTaken || 0;
      }
    });

    const difficultyStats = Object.keys(difficultyMap).map((key) => {
      const d = difficultyMap[key];
      return {
        difficulty: key,
        count: d.count,
        accuracy: d.count > 0 ? Math.round((d.correct / d.count) * 100) : 0,
        avgTime: d.count > 0 ? Math.round((d.time / d.count) * 10) / 10 : 0,
      };
    });

    // 3. Category Breakdown (DSA, Aptitude, SQL, Reasoning)
    const categoryMap = {};
    progressList.forEach((p) => {
      const cat = p.type || 'DSA';
      if (!categoryMap[cat]) categoryMap[cat] = { category: cat, count: 0, correct: 0 };
      categoryMap[cat].count += 1;
      if (p.isCorrect) categoryMap[cat].correct += 1;
    });

    const categoryStats = Object.values(categoryMap).map((c) => ({
      name: c.category,
      value: c.count,
      accuracy: Math.round((c.correct / c.count) * 100),
    }));

    // 4. Mock Test Analytics
    const testCount = resultList.length;
    const passedTests = resultList.filter((r) => r.status === 'Passed').length;
    const testPassRate = testCount > 0 ? Math.round((passedTests / testCount) * 100) : 0;
    const avgTestScore = testCount > 0 ? Math.round((resultList.reduce((acc, curr) => acc + curr.score, 0) / testCount) * 10) / 10 : 0;

    // 5. Activity Timeline / Progress Trend (last 10 entries)
    const recentTrend = progressList.slice(-10).map((p, idx) => ({
      index: idx + 1,
      title: p.title.length > 15 ? p.title.substring(0, 15) + '...' : p.title,
      timeTaken: p.timeTaken,
      isCorrect: p.isCorrect ? 100 : 0,
      date: p.solvedAt.toISOString().split('T')[0],
    }));

    // 6. Placement Readiness Score (0-100)
    // Formula: (Accuracy * 0.4) + (Min(TotalSolved, 50)/50 * 30) + (Min(Streak, 10)/10 * 15) + (PassRate * 0.15)
    const volumeScore = Math.min(totalProblems / 40, 1) * 30;
    const streakScore = Math.min((user.streak || 1) / 10, 1) * 15;
    const accScore = (overallAccuracy / 100) * 40;
    const testScore = (testPassRate / 100) * 15;
    const readinessScore = Math.min(100, Math.round(volumeScore + streakScore + accScore + testScore));

    res.status(200).json({
      success: true,
      analytics: {
        summary: {
          totalProblems,
          overallAccuracy,
          avgTimePerQuestion,
          totalTimeSpent,
          streak: user.streak || 1,
          points: user.points || 0,
          testCount,
          testPassRate,
          avgTestScore,
          readinessScore,
        },
        topicAccuracyList: topicAccuracyList.sort((a, b) => b.total - a.total),
        weakAreas,
        difficultyStats,
        categoryStats,
        recentTrend,
      },
    });
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error calculating analytics',
    });
  }
};
