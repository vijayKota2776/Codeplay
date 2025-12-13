const User = require('../models/User');

function updateStreak(user) {
  const today = new Date().toDateString();
  const last = user.lastActiveDate ? user.lastActiveDate.toDateString() : null;
  if (last === today) return;

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

  if (last === yesterday) {
    user.currentStreak = (user.currentStreak || 0) + 1;
  } else {
    user.currentStreak = 1;
  }

  if (!user.longestStreak || user.currentStreak > user.longestStreak) {
    user.longestStreak = user.currentStreak;
  }

  user.lastActiveDate = new Date();
}

const getProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const record = user.progress.find(p => p.courseId === courseId);

    if (!record) {
      return res.json({ completed: [], xp: 0 });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProgress = async (req, res) => {
  const { courseId, topicId, xpGained = 10 } = req.body;

  console.log('Update progress request:', { userId: req.user.id, courseId, topicId, xpGained });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  updateStreak(user);

  let record = user.progress.find(p => p.courseId === courseId);
  if (!record) {
    record = { courseId, completed: [], xp: 0 };
    user.progress.push(record);
  }

  if (!record.completed.includes(topicId)) {
    record.completed.push(topicId);
    record.xp += xpGained;
    console.log('Topic marked complete. New XP:', record.xp);
  } else {
    console.log('Topic already completed');
  }

  await user.save();
  console.log('Progress saved successfully');
  res.json(user.progress);
};

module.exports = { getProgress, updateProgress };
