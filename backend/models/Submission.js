const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
},
  courseId: String,
  exerciseId: String,
  code: String,
  result: String,
  peerReviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'PeerReview' 
}]
}, { timestamps: true });
module.exports = mongoose.model('Submission', submissionSchema);
