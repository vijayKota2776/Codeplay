const PeerReview = require('../models/PeerReview');
const Submission = require('../models/Submission');

const addReview = async (req, res) => {
  try {
    const { comment, vote = 0 } = req.body;
    const submissionId = req.params.id;

    const review = new PeerReview({
      submissionId,
      reviewerId: req.user.id,
      comment,
      vote
    });

    await review.save();

    await Submission.findByIdAndUpdate(
      submissionId,
      { $push: { peerReviews: review._id } }
    );

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getReviews = async (req, res) => {
  const reviews = await PeerReview.find({ submissionId: req.params.id })
    .populate('reviewerId', 'email');
  res.json(reviews);
};

module.exports = {
  addReview,
  getReviews
};
