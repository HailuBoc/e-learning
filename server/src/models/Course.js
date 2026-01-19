const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  contentHtml: { type: String, required: true }, // Simple HTML content for now
  videoUrl: { type: String }, // Optional video URL
  order: { type: Number, required: true }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  thumbnailUrl: {
    type: String
  },
  lessons: [lessonSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
