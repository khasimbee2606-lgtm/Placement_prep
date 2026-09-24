import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Problem type is required'],
      enum: ['DSA', 'Aptitude', 'SQL', 'Reasoning', 'Core CS'],
      default: 'DSA',
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    description: {
      type: String,
      default: '',
    },
    platform: {
      type: String,
      enum: ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeChef', 'Custom'],
      default: 'LeetCode',
    },
    problemUrl: {
      type: String,
      default: '',
    },
    companyTags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
