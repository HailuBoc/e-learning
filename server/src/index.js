const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

 const Course = require('./models/Course');

const app = express();
const PORT = process.env.PORT || 5000;

 const seedCoursesIfEmpty = async () => {
   const existingCount = await Course.countDocuments();
   if (existingCount > 0) return;

   await Course.insertMany([
     {
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
   ]);
 };

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
})
.then(async () => {
  console.log('MongoDB connected');
  try {
    await seedCoursesIfEmpty();
  } catch (err) {
    console.error('Course seeding error:', err);
  }
})
.catch(err => console.error('MongoDB connection error:', err));

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const enrollmentRoutes = require('./routes/enrollment');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
