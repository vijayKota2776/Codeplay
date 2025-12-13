const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  content: String,
  exerciseId: String,
  testCases: [{ input: String, expected: String }]
});

const sectionSchema = new mongoose.Schema({
  title: String,
  order: Number,
  topics: [topicSchema]
});

const courseSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['docs', 'video'] },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  tags: [String],
  sections: [sectionSchema]
});

module.exports = mongoose.model('Course', courseSchema);
