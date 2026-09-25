import express from 'express';
import {
  addPracticeProblem,
  getPracticeHistory,
  deletePracticeProblem,
  getCuratedProblems,
  getActivityHeatmap,
  getDailyGoals,
  addDailyGoal,
  toggleDailyGoal,
  deleteDailyGoal,
  getNotifications,
} from '../controllers/practiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All practice routes require authentication

router.route('/')
  .post(addPracticeProblem)
  .get(getPracticeHistory);

router.delete('/:id', deletePracticeProblem);
router.get('/curated', getCuratedProblems);
router.get('/heatmap', getActivityHeatmap);

// Daily Goals
router.route('/goals')
  .get(getDailyGoals)
  .post(addDailyGoal);
router.put('/goals/:id', toggleDailyGoal);
router.delete('/goals/:id', deleteDailyGoal);

// Notifications
router.get('/notifications', getNotifications);

export default router;
