const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

// Middleware to verify user
const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// GET /api/enrollments/me - Get my enrollments
router.get('/me', verifyUser, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.userId })
      .populate('courseId', 'title slug thumbnailUrl'); // Populate basic course info
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/enrollments - Enroll in a course
router.post('/', verifyUser, async (req, res) => {
  try {
    const { courseId } = req.body;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if already enrolled
    const existing = await Enrollment.findOne({ userId: req.user.userId, courseId });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });

    const enrollment = new Enrollment({
      userId: req.user.userId,
      courseId
    });

    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/enrollments/:id/progress - Update progress
router.put('/:id/progress', verifyUser, async (req, res) => {
  try {
    const { progress, completedLessons } = req.body;
    
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    if (progress !== undefined) enrollment.progress = progress;
    if (completedLessons) enrollment.completedLessons = completedLessons;

    await enrollment.save();
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/enrollments/check/:courseId - Check if enrolled in specific course
router.get('/check/:courseId', verifyUser, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      userId: req.user.userId,
      courseId: req.params.courseId
    });
    res.json({ enrolled: !!enrollment, enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
