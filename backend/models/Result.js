import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number, // Percentage 0 - 100
      required: true,
    },
    timeSpent: {
      type: Number, // in seconds
      required: true,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    incorrectAnswers: {
      type: Number,
      default: 0,
    },
    unattempted: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Passed', 'Failed'],
      default: 'Passed',
    },
  },
  {
    timestamps: true,
  }
);

const Result = mongoose.model('Result', resultSchema);
export default Result;
