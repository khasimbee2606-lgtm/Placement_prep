import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    enum: ['Aptitude', 'Reasoning', 'Coding', 'Verbal'],
    default: 'Aptitude',
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number, // index 0, 1, 2, 3
    required: true,
  },
  marks: {
    type: Number,
    default: 1,
  },
  negativeMarks: {
    type: Number,
    default: 0.25,
  },
  explanation: {
    type: String,
    default: '',
  },
});

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    companyPattern: {
      type: String,
      enum: ['TCS NQT', 'Infosys Springboard', 'Wipro NLTH', 'Cognizant', 'General Assessment'],
      default: 'TCS NQT',
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
      default: 30,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    passMarks: {
      type: Number,
      default: 60,
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model('Test', testSchema);
export default Test;
