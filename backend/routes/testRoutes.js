import express from 'express';
import {
  getAllTests,
  getTestById,
  submitTest,
  getUserResults,
} from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All test routes require authentication

router.get('/', getAllTests);
router.get('/results/my', getUserResults);
router.get('/:id', getTestById);
router.post('/:id/submit', submitTest);

export default router;
