const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
},
  password: { 
    type: String, 
    required: true 
},
  role: { 
    type: String, 
    enum: ['learner', 'instructor', 'admin'], 
    default: 'learner' 
},
  progress: [{
    courseId: String,
    completed: [String],
    xp: { type: Number, default: 0 }
  }],
  lastActiveDate: { 
    type: Date 
},
  currentStreak: { 
    type: Number, 
    default: 0 
},
  longestStreak: { 
    type: Number, 
    default: 0 
}
});

module.exports = mongoose.model('User', userSchema);
