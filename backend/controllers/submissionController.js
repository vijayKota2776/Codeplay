const Submission = require('../models/Submission');

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

const createSubmission = async (req, res) => {
  try {
    const { courseId, topicId, exerciseId, code, result, status } = req.body;

    // 1. Create Submission
    const submission = new Submission({
      userId: req.user.id,
      courseId,
      topicId,
      exerciseId,
      code,
      result,
      status
    });

    await submission.save();

    // 2. Update User Progress & Streak
    const user = await User.findById(req.user.id);
    if (user) {
      updateStreak(user);

      // Find or create progress record for this course
      let record = user.progress.find(p => p.courseId === courseId);
      if (!record) {
        user.progress.push({ courseId, completed: [], xp: 0 });
        // Get the newly created subdocument
        record = user.progress[user.progress.length - 1];
      }

      // Add topic if not already completed
      // Use topicId if available, fall back to exerciseId if it acts as unique topic identifier
      const uniqueId = topicId || exerciseId;

      if (uniqueId && !record.completed.includes(uniqueId)) {
        record.completed.push(uniqueId);
        record.xp += 10; // Default 10 XP per submission
      }

      await user.save();
    }

    res.status(201).json(submission);
  } catch (err) {
    console.error('Submission error:', err);
    res.status(400).json({ error: err.message });
  }
};

const getMySubmissions = async (req, res) => {
  const subs = await Submission.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(subs);
};

const getExerciseSubmissions = async (req, res) => {
  const subs = await Submission.find({ exerciseId: req.params.exerciseId })
    .populate('userId', 'email');
  res.json(subs);
};

module.exports = {
  createSubmission,
  getMySubmissions,
  getExerciseSubmissions
};
