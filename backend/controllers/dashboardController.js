
const mongoose = require('mongoose');
const User = require('../models/User');
const Submission = require('../models/Submission');
const PeerReview = require('../models/PeerReview');
const Course = require('../models/Course');

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const submissionsCount = await Submission.countDocuments({ userId: req.user.id });
    const reviewsGiven = await PeerReview.countDocuments({ reviewerId: req.user.id });
    const totalXp = user.progress.reduce((sum, p) => sum + (p.xp || 0), 0);


    const completedByCourse = await Promise.all(
      user.progress.map(async (p) => {
        let courseTitle = 'Unknown Course';
        if (mongoose.isValidObjectId(p.courseId)) {
          const course = await Course.findById(p.courseId).select('title').lean();
          if (course) courseTitle = course.title;
        }
        return {
          courseId: p.courseId,
          courseTitle,
          completedCount: p.completed?.length || 0,
          xp: p.xp || 0,
        };
      })
    );


    const rawRecent = await Submission.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const recentCourseIds = [
      ...new Set(rawRecent.map((s) => s.courseId).filter((id) => mongoose.isValidObjectId(id))),
    ];

    const recentCourses = recentCourseIds.length
      ? await Course.find({ _id: { $in: recentCourseIds } })
        .select('title sections')
        .lean()
      : [];

    const courseMap = new Map(
      recentCourses.map((c) => [String(c._id), c])
    );

    const recentSubmissions = rawRecent.map((s) => {
      const course = courseMap.get(String(s.courseId));
      let topicTitle = s.topicId;
      if (course?.sections) {
        for (const sec of course.sections) {
          const found = (sec.topics || []).find(
            (t) => String(t._id) === String(s.topicId)
          );
          if (found) {
            topicTitle = found.title;
            break;
          }
        }
      }
      return {
        id: s._id,
        courseId: s.courseId,
        courseTitle: course?.title || 'Unknown course',
        topicId: s.topicId,
        topicTitle: topicTitle || 'Unknown topic',
        exerciseId: s.exerciseId,
        status: s.status || 'passed',
        createdAt: s.createdAt,
      };
    });

    // -------- nextTopic: first incomplete topic --------
    let nextTopic = null;
    for (const p of user.progress) {
      if (!mongoose.isValidObjectId(p.courseId)) continue;
      const course = await Course.findById(p.courseId).lean();
      if (!course?.sections) continue;

      const done = new Set((p.completed || []).map((id) => String(id)));
      let foundTopic = null;

      for (const sec of course.sections) {
        for (const t of sec.topics || []) {
          if (!done.has(String(t._id))) {
            foundTopic = t;
            break;
          }
        }
        if (foundTopic) break;
      }

      if (foundTopic) {
        nextTopic = {
          courseId: p.courseId,
          courseTitle: course.title,
          topicId: foundTopic._id,
          topicTitle: foundTopic.title,
          xp: foundTopic.maxXp || 10,
        };
        break;
      }
    }

    // -------- Formatted Response for Frontend --------

    // Calculate Stats
    // Assuming 10 hours per course for mock calculation if not tracked
    // Real calculation: sum of durations? For now mock based on progress.
    const totalHours = Math.floor(totalXp / 100) + (user.progress.length * 2);

    // Calculate total completed labs/topics across all courses
    const labsCompleted = user.progress.reduce((acc, curr) => acc + (curr.completed ? curr.completed.length : 0), 0);

    const stats = {
      totalHours: totalHours,
      coursesEnrolled: user.progress.length, // Number of active courses
      labsCompleted: labsCompleted,
      submissions: submissionsCount,
      currentStreak: user.currentStreak || 0,
      totalXp: totalXp
    };

    // Format Recent Activity
    // The frontend expects: { type: 'submission', description: '...', time: '...', badge: { text: '', variant: '' } }
    const recentActivity = recentSubmissions.map(sub => {
      const timeDiff = new Date() - new Date(sub.createdAt);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      let timeString = 'Just now';

      if (days > 0) timeString = `${days} day${days > 1 ? 's' : ''} ago`;
      else if (hours > 0) timeString = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      else if (timeDiff > 60000) timeString = `${Math.floor(timeDiff / 60000)} mins ago`;

      return {
        type: 'submission',
        description: `Completed ${sub.topicTitle || 'an exercise'} in ${sub.courseTitle}`,
        time: timeString,
        badge: {
          text: '+10 XP',
          variant: 'success'
        }
      };
    });

    return res.json({
      stats,
      recentActivity,
      completedByCourse, // Keeping these just in case other views need them
      nextTopic
    });
  } catch (err) {
    console.error('Dashboard Error:', err);
    return res.status(500).json({ error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select('email userName progress');
    const rows = users.map((u) => ({
      email: u.email,
      name: u.userName || u.email.split('@')[0],
      xp: u.progress.reduce((sum, p) => sum + (p.xp || 0), 0),
    }));
    rows.sort((a, b) => b.xp - a.xp);
    res.json(rows.slice(0, 20));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard, getLeaderboard };
