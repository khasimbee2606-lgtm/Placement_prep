import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: false, // Can be custom problem or referenced problem
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['DSA', 'Aptitude', 'SQL', 'Reasoning', 'Core CS'],
      default: 'DSA',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    timeTaken: {
      type: Number, // in minutes
      required: [true, 'Time taken in minutes is required'],
      min: 1,
    },
    isCorrect: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: '',
    },
    solvedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
export default UserProgress;
