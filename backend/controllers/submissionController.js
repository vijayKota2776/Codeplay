const Submission = require('../models/Submission');

const createSubmission = async (req, res) => {
  try {
    const { courseId, exerciseId, code, result } = req.body;

    const submission = new Submission({
      userId: req.user.id,
      courseId,
      exerciseId,
      code,
      result
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
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
