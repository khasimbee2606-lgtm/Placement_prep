import Test from '../models/Test.js';
import Result from '../models/Result.js';
import User from '../models/User.js';
import UserProgress from '../models/UserProgress.js';

// @desc    Get all available mock tests
// @route   GET /api/tests
// @access  Private
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().select('-questions.correctAnswer');
    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });
  } catch (error) {
    console.error('Error fetching mock tests:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching mock tests',
    });
  }
};

// @desc    Get mock test by ID for attempting (timer-based)
// @route   GET /api/tests/:id
// @access  Private
export const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    // Exclude correctAnswer and explanation so client cannot inspect beforehand
    const sanitizedQuestions = test.questions.map((q) => ({
      _id: q._id,
      question: q.question,
      section: q.section,
      options: q.options,
      marks: q.marks,
      negativeMarks: q.negativeMarks,
    }));

    res.status(200).json({
      success: true,
      test: {
        _id: test._id,
        title: test.title,
        companyPattern: test.companyPattern,
        duration: test.duration,
        totalQuestions: test.questions.length,
        passMarks: test.passMarks,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    console.error('Error fetching test detail:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching test',
    });
  }
};

// @desc    Submit mock test answers & evaluate with negative marking
// @route   POST /api/tests/:id/submit
// @access  Private
export const submitTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found',
      });
    }

    const { answers, timeSpent } = req.body;
    // answers is an object or array: { [questionId]: selectedOptionIndex }

    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;
    let totalMarksPossible = 0;

    // Section breakdown accumulator
    const sectionStats = {
      Aptitude: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0 },
      Reasoning: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0 },
      Coding: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0 },
      Verbal: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0 },
    };

    const evaluatedQuestions = test.questions.map((q) => {
      const qId = q._id.toString();
      const selected = answers ? answers[qId] : undefined;
      const marks = q.marks || 1;
      const negMarks = q.negativeMarks || 0.25;
      totalMarksPossible += marks;

      const sec = q.section || 'Aptitude';
      if (!sectionStats[sec]) {
        sectionStats[sec] = { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0 };
      }
      sectionStats[sec].total += 1;

      let isCorrect = false;
      let status = 'unattempted';

      if (selected !== undefined && selected !== null && selected !== -1) {
        sectionStats[sec].attempted += 1;
        if (Number(selected) === q.correctAnswer) {
          isCorrect = true;
          status = 'correct';
          correctCount += 1;
          totalScore += marks;
          sectionStats[sec].correct += 1;
          sectionStats[sec].marks += marks;
        } else {
          status = 'incorrect';
          incorrectCount += 1;
          totalScore -= negMarks;
          sectionStats[sec].incorrect += 1;
          sectionStats[sec].marks -= negMarks;
        }
      } else {
        unattemptedCount += 1;
      }

      return {
        _id: q._id,
        question: q.question,
        section: q.section,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedAnswer: selected !== undefined ? selected : null,
        isCorrect,
        status,
        explanation: q.explanation || 'Refer to fundamental logic for this concept.',
      };
    });

    // Ensure total score is not negative
    totalScore = Math.max(0, Math.round(totalScore * 100) / 100);

    const attemptedTotal = correctCount + incorrectCount;
    const accuracy = attemptedTotal > 0 ? Math.round((correctCount / attemptedTotal) * 100) : 0;
    const percentage = totalMarksPossible > 0 ? Math.round((totalScore / totalMarksPossible) * 100) : 0;
    const passed = percentage >= (test.passMarks || 50);

    // Save Result record in MongoDB
    const result = await Result.create({
      userId: req.user._id,
      testId: test._id,
      score: totalScore,
      totalMarks: totalMarksPossible,
      accuracy,
      timeSpent: Number(timeSpent) || 0,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unattempted: unattemptedCount,
      status: passed ? 'Passed' : 'Failed',
    });

    // Award XP to candidate
    let awardedXP = 40; // Base completion XP
    if (passed) awardedXP += 60; // Pass bonus
    if (accuracy >= 80) awardedXP += 30; // High accuracy bonus

    const user = await User.findById(req.user._id);
    user.points += awardedXP;
    user.streak = (user.streak || 0) + 1;
    user.lastActiveDate = new Date();
    await user.save();

    // Broadcast real-time leaderboard update
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
      message: `Test submitted! Score: ${totalScore}/${totalMarksPossible} (${passed ? 'PASSED 🎉' : 'Needs Review'}). +${awardedXP} XP!`,
      result: {
        _id: result._id,
        testTitle: test.title,
        companyPattern: test.companyPattern,
        score: totalScore,
        totalMarks: totalMarksPossible,
        percentage,
        accuracy,
        status: result.status,
        timeSpent: result.timeSpent,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        unattempted: unattemptedCount,
        sectionStats,
        evaluatedQuestions,
      },
      awardedXP,
      userPoints: user.points,
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting test',
    });
  }
};

// @desc    Get user test results history
// @route   GET /api/tests/results/my
// @access  Private
export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user._id })
      .populate('testId', 'title companyPattern duration passMarks')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching test results',
    });
  }
};
