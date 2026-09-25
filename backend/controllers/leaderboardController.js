import User from '../models/User.js';

// @desc    Get leaderboard rankings based on points and streak
// @route   GET /api/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    // Rank users by points desc, streak desc, problemsSolved desc
    const users = await User.find()
      .select('name college targetCompany streak points problemsSolved createdAt')
      .sort({ points: -1, streak: -1, problemsSolved: -1 })
      .limit(50);

    let currentUserRank = -1;
    const leaderboard = users.map((u, index) => {
      const isCurrentUser = u._id.toString() === currentUserId;
      const rank = index + 1;
      if (isCurrentUser) currentUserRank = rank;

      return {
        rank,
        _id: u._id,
        name: u.name,
        college: u.college || 'Engineering Institute',
        targetCompany: u.targetCompany || 'Top Tech',
        streak: u.streak || 1,
        points: u.points || 0,
        problemsSolved: u.problemsSolved || 0,
        isCurrentUser,
      };
    });

    res.status(200).json({
      success: true,
      currentUserRank: currentUserRank > 0 ? currentUserRank : users.length + 1,
      totalParticipants: users.length,
      leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching leaderboard',
    });
  }
};
