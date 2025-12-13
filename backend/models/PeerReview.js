const mongoose = require('mongoose');

const peerReviewSchema = new mongoose.Schema({
  submissionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Submission', 
    required: true 
},
  reviewerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
},
  comment: { 
    type: String, 
    required: true 
},
  vote: { 
    type: Number, 
    enum: [-1, 0, 1], 
    default: 0 
}
}, { timestamps: true });

module.exports = mongoose.model('PeerReview', peerReviewSchema);
