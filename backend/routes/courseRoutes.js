
const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const requireAuth = require('../middleware/auth');
const requireAdmin = require('../middleware/adminAuth');

function basicCourseValidator(req, res, next) {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'title is required' });
  }
  if (!description) {
    return res.status(400).json({ message: 'description is required' });
  }
  next();
}


router.post(
  '/',
  requireAuth,
  requireAdmin,
  basicCourseValidator,
  async (req, res) => {
    try {
      const course = new Course(req.body);
      await course.save();
      res.status(201).json(course);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);


router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().select(
      'title description duration icon type difficulty level tags sections topics'
    );
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
