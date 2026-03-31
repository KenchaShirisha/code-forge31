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

async function fixUser() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected');

  // Delete old user and recreate with fresh password
  await User.deleteOne({ email: 'admin@codeforge.com' });
  console.log('Old user deleted');

  const password = await bcrypt.hash('Admin@123', 10);
  const user = await User.create({
    name: 'Admin',
    email: 'admin@codeforge.com',
    password,
    role: 'admin',
  });

  // Verify password works
  const match = await bcrypt.compare('Admin@123', user.password);
  console.log('Password match test:', match ? '✅ PASS' : '❌ FAIL');
  console.log('✅ User recreated!');
  console.log('Email:    admin@codeforge.com');
  console.log('Password: Admin@123');
  await mongoose.disconnect();
}

fixUser().catch(console.error);
