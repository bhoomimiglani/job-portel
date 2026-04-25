const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: String,
      default: '',
    },
    responsibilities: {
      type: String,
      default: '',
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote', 'hybrid'],
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    salaryMax: {
      type: Number,
      default: 0,
    },
    salaryCurrency: {
      type: String,
      default: 'USD',
    },
    salaryPeriod: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
    skills: [String],
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      default: 'entry',
    },
    education: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft', 'pending'],
      default: 'active',
    },
    views: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Text index for search
jobSchema.index({ title: 'text', description: 'text', companyName: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
