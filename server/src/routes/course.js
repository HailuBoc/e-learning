const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

const fallbackCourses = [
  {
    _id: 'seed-react-fundamentals',
    title: 'React Fundamentals: Build Your First App',
    slug: 'react-fundamentals-build-your-first-app',
    description: 'Learn React from scratch: components, props, state, hooks, and routing with hands-on practice.',
    price: 49,
    category: 'Development',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    lessons: [
      { title: 'JSX, Components, and Props', contentHtml: '<p>Learn JSX and how to build components.</p>', order: 1 },
      { title: 'State and Effects with Hooks', contentHtml: '<p>Use <strong>useState</strong> and <strong>useEffect</strong> to manage state.</p>', order: 2 }
    ]
  },
  {
    _id: 'seed-uiux-essentials',
    title: 'UI/UX Design Essentials',
    slug: 'ui-ux-design-essentials',
    description: 'Master the foundations of user experience and visual design: layout, typography, color, and prototyping.',
    price: 39,
    category: 'Design',
    difficulty: 'Beginner',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    lessons: [
      { title: 'UX Principles and User Flows', contentHtml: '<p>Understand user needs and design effective flows.</p>', order: 1 },
      { title: 'Typography and Color Systems', contentHtml: '<p>Build consistent, accessible UI styles.</p>', order: 2 }
    ]
  },
  {
    _id: 'seed-excel-analytics',
    title: 'Business Analytics with Excel',
    slug: 'business-analytics-with-excel',
    description: 'Analyze data using Excel: formulas, pivot tables, dashboards, and actionable reporting techniques.',
    price: 29,
    category: 'Business',
    difficulty: 'Intermediate',
    thumbnailUrl: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&w=1200&q=80',
    lessons: [
      { title: 'Formulas and Data Cleaning', contentHtml: '<p>Clean datasets and use formulas effectively.</p>', order: 1 },
      { title: 'Pivot Tables and Dashboards', contentHtml: '<p>Create pivot tables and build a dashboard.</p>', order: 2 }
    ]
  },
  {
    _id: 'seed-nodejs-advanced',
    title: 'Advanced Node.js: APIs at Scale',
    slug: 'advanced-nodejs-apis-at-scale',
    description: 'Build scalable Node.js APIs with Express, authentication, validation, and production best practices.',
    price: 59,
    category: 'Development',
    difficulty: 'Advanced',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    lessons: [
      { title: 'API Architecture and Middleware', contentHtml: '<p>Organize routes, middleware, and error handling.</p>', order: 1 },
      { title: 'Auth, Security, and Deployment', contentHtml: '<p>JWT, cookies, CORS, rate limiting, and deployment.</p>', order: 2 }
    ]
  }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

const applyFallbackFilters = ({ category, difficulty, search }) => {
  const normalizedSearch = typeof search === 'string' ? search.trim().toLowerCase() : '';

  return fallbackCourses
    .filter((course) => {
      if (category && course.category !== category) return false;
      if (difficulty && course.difficulty !== difficulty) return false;

      if (!normalizedSearch) return true;

      const haystack = `${course.title} ${course.description} ${course.category}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    })
    .map((course) => ({
      ...course,
      lessons: Array.isArray(course.lessons)
        ? course.lessons.map(({ title, order }) => ({ title, order }))
        : []
    }));
};

// Middleware to check if user is admin
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// GET /api/courses - List all courses
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};

    if (!isDbConnected()) {
      return res.json(applyFallbackFilters({ category, difficulty, search }));
    }
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    const courses = await Course.find(query)
      .select('-lessons.contentHtml -lessons.videoUrl') // Exclude content for list view
      .sort({ createdAt: -1 });
      
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/courses/:slug - Get course details
router.get('/:slug', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const course = fallbackCourses.find((c) => c.slug === req.params.slug);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      return res.json(course);
    }

    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // TODO: Hide full lesson content if user not enrolled?
    // For simplicity now, we return full content or handle restriction on frontend/enrollment check
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/courses - Create course (Admin)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    // Generate slug from title if not provided
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/courses/:id - Update course (Admin)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/courses/:id - Delete course (Admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
