const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
    },
    resume: {
      type: String, // file path or URL
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn'],
      default: 'pending',
    },
    notes: {
      type: String, // employer notes
      default: '',
    },
    interviewDate: {
      type: Date,
    },
    interviewLocation: {
      type: String,
      default: '',
    },
    interviewType: {
      type: String,
      enum: ['in-person', 'video', 'phone', ''],
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
