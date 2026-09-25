import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Problem from './models/Problem.js';
import Test from './models/Test.js';
import UserProgress from './models/UserProgress.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'placement_tracker',
    });
    console.log('[Seed] Connected to MongoDB Atlas...');

    // 1. Seed Dummy Users for Leaderboard
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const dummyUsers = [
      {
        name: 'Aarav Sharma',
        email: 'aarav@iitd.ac.in',
        password: hashedPassword,
        college: 'IIT Delhi',
        targetCompany: 'Google & Product Tech',
        graduationYear: 2026,
        streak: 19,
        points: 1240,
        problemsSolved: 88,
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@nitt.edu',
        password: hashedPassword,
        college: 'NIT Trichy',
        targetCompany: 'Microsoft',
        graduationYear: 2026,
        streak: 16,
        points: 980,
        problemsSolved: 72,
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@bits.ac.in',
        password: hashedPassword,
        college: 'BITS Pilani',
        targetCompany: 'Amazon',
        graduationYear: 2026,
        streak: 13,
        points: 860,
        problemsSolved: 64,
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@vit.ac.in',
        password: hashedPassword,
        college: 'VIT Vellore',
        targetCompany: 'TCS Digital / Ninja',
        graduationYear: 2026,
        streak: 10,
        points: 720,
        problemsSolved: 54,
      },
      {
        name: 'Pooja Nair',
        email: 'pooja@iiit.ac.in',
        password: hashedPassword,
        college: 'IIIT Hyderabad',
        targetCompany: 'Goldman Sachs FinTech',
        graduationYear: 2026,
        streak: 14,
        points: 810,
        problemsSolved: 60,
      },
      {
        name: 'Vikram Reddy',
        email: 'vikram@srm.edu',
        password: hashedPassword,
        college: 'SRM Institute of Science & Tech',
        targetCompany: 'Infosys Specialist Programmer',
        graduationYear: 2026,
        streak: 8,
        points: 590,
        problemsSolved: 44,
      },
      {
        name: 'Aditya Deshmukh',
        email: 'aditya@coep.ac.in',
        password: hashedPassword,
        college: 'COEP Tech University',
        targetCompany: 'Wipro NLTH / Accenture',
        graduationYear: 2026,
        streak: 6,
        points: 480,
        problemsSolved: 36,
      },
    ];

    for (const u of dummyUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
      }
    }
    console.log('[Seed] Dummy leaderboard users verified/inserted');

    // 2. Seed Curated Problems Bank
    const curatedProblems = [
      {
        title: 'Two Sum',
        type: 'DSA',
        topic: 'Arrays & Hashing',
        difficulty: 'Easy',
        platform: 'LeetCode',
        companyTags: ['Google', 'Amazon', 'TCS Digital'],
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        type: 'DSA',
        topic: 'Sliding Window',
        difficulty: 'Medium',
        platform: 'LeetCode',
        companyTags: ['Amazon', 'Microsoft'],
        description: 'Find the length of the longest substring without repeating characters using the sliding window technique.',
      },
      {
        title: 'Coin Change (Minimum Coins)',
        type: 'DSA',
        topic: 'Dynamic Programming',
        difficulty: 'Medium',
        platform: 'LeetCode',
        companyTags: ['Google', 'Infosys SP'],
        description: 'Compute the fewest number of coins that you need to make up an amount using bottom-up dynamic programming.',
      },
      {
        title: 'Lowest Common Ancestor in Binary Tree',
        type: 'DSA',
        topic: 'Trees & Graphs',
        difficulty: 'Medium',
        platform: 'GeeksforGeeks',
        companyTags: ['Microsoft', 'Amazon'],
        description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.',
      },
      {
        title: 'Percentages & Successive Discount',
        type: 'Aptitude',
        topic: 'Quantitative Aptitude',
        difficulty: 'Easy',
        platform: 'Custom',
        companyTags: ['TCS NQT', 'Infosys', 'Cognizant'],
        description: 'Calculate effective percentage increase and successive discount formula shortcuts.',
      },
      {
        title: 'Time, Speed & Train Crossing Distance',
        type: 'Aptitude',
        topic: 'Quantitative Aptitude',
        difficulty: 'Medium',
        platform: 'Custom',
        companyTags: ['TCS NQT', 'Wipro', 'Capgemini'],
        description: 'Two trains running in opposite directions cross a man standing on the platform. Find relative speed.',
      },
      {
        title: 'Department Highest Salary & Second Max',
        type: 'SQL',
        topic: 'SQL Joins & Group By',
        difficulty: 'Medium',
        platform: 'LeetCode',
        companyTags: ['Amazon', 'TCS Digital'],
        description: 'Write a SQL query to find employees who have the highest salary in each of the departments using DENSE_RANK() or JOIN.',
      },
      {
        title: 'Syllogisms & Logical Deductions',
        type: 'Reasoning',
        topic: 'Logical Reasoning',
        difficulty: 'Easy',
        platform: 'Custom',
        companyTags: ['Infosys', 'TCS NQT'],
        description: 'Verify Venn diagram conclusions for statements: Some A are B, All B are C.',
      },
    ];

    for (const prob of curatedProblems) {
      const exists = await Problem.findOne({ title: prob.title });
      if (!exists) {
        await Problem.create(prob);
      }
    }
    console.log('[Seed] Curated problems verified/inserted');

    // 3. Seed Mock Tests (TCS NQT & Infosys Springboard Pattern)
    const mockTests = [
      {
        title: 'TCS NQT National Qualifier Mock Test 2026',
        companyPattern: 'TCS NQT',
        duration: 25, // 25 minutes
        passMarks: 60,
        questions: [
          {
            question: 'A shopkeeper marks an article at 40% above the cost price and allows a discount of 20%. What is his overall gain percentage?',
            section: 'Aptitude',
            options: ['12%', '14%', '16%', '20%'],
            correctAnswer: 0, // 12%
            marks: 2,
            negativeMarks: 0.5,
            explanation: 'Let CP = 100. MP = 140. SP after 20% discount = 140 * 0.8 = 112. Gain = 112 - 100 = 12%.',
          },
          {
            question: 'A train 180 meters long is running at a speed of 54 km/hr. In how many seconds will it cross a telegraph post?',
            section: 'Aptitude',
            options: ['10 seconds', '12 seconds', '15 seconds', '18 seconds'],
            correctAnswer: 1, // 12 seconds
            marks: 2,
            negativeMarks: 0.5,
            explanation: 'Speed in m/s = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 180 / 15 = 12 seconds.',
          },
          {
            question: 'Statements: 1. All apples are fruits. 2. Some fruits are sweet.\nConclusions:\nI. Some apples are sweet.\nII. Some fruits are apples.',
            section: 'Reasoning',
            options: ['Only conclusion I follows', 'Only conclusion II follows', 'Both I and II follow', 'Neither I nor II follows'],
            correctAnswer: 1, // Only II follows
            marks: 2,
            negativeMarks: 0.5,
            explanation: 'Since all apples are fruits, the converse "Some fruits are apples" is unconditionally valid. "Some apples are sweet" is not guaranteed.',
          },
          {
            question: 'In a certain code, "CAMPUS" is written as "DCORTW". How is "SYSTEM" written in that code?',
            section: 'Reasoning',
            options: ['TAUUGN', 'TATSFN', 'UAUVGO', 'TBVTHP'],
            correctAnswer: 0, // TAUUGN
            marks: 2,
            negativeMarks: 0.5,
            explanation: 'Letter shifting: C(+1)=D, A(+2)=C, M(+2)=O, P(+2)=R, U(+2)=T, S(+4)=W pattern. S(+1)=T, Y(+2)=A, S(+2)=U, T(+1)=U, E(+2)=G, M(+1)=N -> TAUUGN.',
          },
          {
            question: 'What is the time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
            section: 'Coding',
            options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'],
            correctAnswer: 2, // O(log N)
            marks: 2,
            negativeMarks: 0.5,
            explanation: 'In a balanced BST, tree height is strictly bounded by log2(N), guaranteeing O(log N) worst-case search time.',
          },
          {
            question: 'In Python, what is the output of: print([i*2 for i in range(4) if i % 2 == 0])?',
            section: 'Coding',
            options: ['[0, 2, 4]', '[0, 4]', '[2, 4]', '[0, 2, 4, 6]'],
            correctAnswer: 1, // [0, 4]
            marks: 2,
            negativeMarks: 0.5,
            explanation: 'range(4) yields 0, 1, 2, 3. The even numbers are 0 and 2. 0*2 = 0, 2*2 = 4. Result is [0, 4].',
          },
        ],
      },
      {
        title: 'Infosys Springboard Specialist Assessment 2026',
        companyPattern: 'Infosys Springboard',
        duration: 20,
        passMarks: 65,
        questions: [
          {
            question: 'Pipe A can fill a tank in 12 hours and Pipe B can fill it in 18 hours. If both pipes are opened together, how long will it take to fill the tank?',
            section: 'Aptitude',
            options: ['6.2 hours', '7.2 hours', '8.0 hours', '9.5 hours'],
            correctAnswer: 1, // 7.2 hours
            marks: 2,
            negativeMarks: 0.5,
            explanation: '1/12 + 1/18 = (3+2)/36 = 5/36 per hour. Total time = 36/5 = 7.2 hours.',
          },
          {
            question: 'Pointing to a gentleman, a woman said: "His only brother is the father of my daughter\'s father." How is the gentleman related to the woman?',
            section: 'Reasoning',
            options: ['Father', 'Uncle / Paternal Uncle', 'Grandfather', 'Brother-in-law'],
            correctAnswer: 1, // Uncle / Brother of husband\'s father
            marks: 2,
            negativeMarks: 0.5,
            explanation: '"My daughter\'s father" is her husband. The father of her husband is her father-in-law. His brother is the husband\'s uncle (uncle to the woman by marriage).',
          },
          {
            question: 'Which of the following database isolation levels prevents Dirty Reads, Non-repeatable Reads, and Phantom Reads?',
            section: 'Coding',
            options: ['Read Committed', 'Repeatable Read', 'Serializable', 'Read Uncommitted'],
            correctAnswer: 2, // Serializable
            marks: 2,
            negativeMarks: 0.5,
            explanation: 'Serializable is the highest ACID isolation level and completely prevents all concurrency anomalies including phantom reads.',
          },
          {
            question: 'What data structure is utilized internally to evaluate postfix expressions and recursion calls?',
            section: 'Coding',
            options: ['Queue', 'Stack (LIFO)', 'Min Heap', 'Hash Table'],
            correctAnswer: 1, // Stack
            marks: 2,
            negativeMarks: 0.5,
            explanation: 'A Stack (Last In First Out) is the standard data structure for function call stack frames and postfix/reverse Polish notation evaluation.',
          },
        ],
      },
    ];

    for (const testData of mockTests) {
      const exists = await Test.findOne({ title: testData.title });
      if (!exists) {
        await Test.create({
          ...testData,
          totalQuestions: testData.questions.length,
        });
      }
    }
    console.log('[Seed] Mock tests verified/inserted');

    console.log('[Seed] Database seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
