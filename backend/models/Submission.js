const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  courseId: String,
  topicId: String,
  exerciseId: String,
  code: String,
  status: String,
  result: String,
  peerReviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PeerReview'
  }]
}, { timestamps: true });
module.exports = mongoose.model('Submission', submissionSchema);
