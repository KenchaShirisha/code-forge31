const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, lowercase: true },
  password: String,
  role: { type: String, default: 'user' },
  avatar: { type: String, default: '' },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  xp: { type: Number, default: 0 },
  enrolledCourses: [],
  completedTopics: [],
  bookmarks: [],
  certificates: [],
  badges: [],
  dailyChallengeStreak: { type: Number, default: 0 },
  activityLog: [],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createUser() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  const existing = await User.findOne({ email: 'admin@codeforge.com' });
  if (existing) {
    console.log('User already exists! Use these credentials to login:');
    console.log('Email:    admin@codeforge.com');
    console.log('Password: Admin@123');
    await mongoose.disconnect();
    return;
  }

  const password = await bcrypt.hash('Admin@123', 10);
  await User.create({
    name: 'Admin',
    email: 'admin@codeforge.com',
    password,
    role: 'admin',
  });

  console.log('✅ User created successfully!');
  console.log('Email:    admin@codeforge.com');
  console.log('Password: Admin@123');
  await mongoose.disconnect();
}

createUser().catch(console.error);
