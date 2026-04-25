const Application = require('../models/Application');
const Job = require('../models/Job');
const sendEmail = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (jobseeker)
const applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('employer', 'email name');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'active') return res.status(400).json({ message: 'This job is no longer accepting applications' });

    const existing = await Application.findOne({ job: req.params.jobId, applicant: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    const resumePath = req.file ? req.file.path.replace(/\\/g, '/') : req.user.resume;

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      employer: job.employer._id,
      coverLetter: req.body.coverLetter || '',
      resume: resumePath,
    });

    // Increment application count
    job.applicationsCount += 1;
    await job.save();

    // Notify employer
    try {
      await sendEmail({
        to: job.employer.email,
        subject: `New Application for ${job.title}`,
        html: `
          <h2>New Job Application</h2>
          <p><strong>${req.user.name}</strong> has applied for <strong>${job.title}</strong>.</p>
          <p>Log in to your dashboard to review the application.</p>
        `,
      });
    } catch (_) { /* email failure shouldn't block the response */ }

    const populated = await Application.findById(application._id)
      .populate('job', 'title companyName location')
      .populate('applicant', 'name email avatar');

    res.status(201).json({ success: true, application: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobseeker's applications
// @route   GET /api/applications/my-applications
// @access  Private (jobseeker)
const getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { applicant: req.user._id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('job', 'title companyName companyLogo location jobType salaryMin salaryMax status')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      applications,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job (employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (employer)
const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { page = 1, limit = 10, status } = req.query;
    const query = { job: req.params.jobId };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('applicant', 'name email avatar phone location skills experience education resume bio')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      applications,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (employer)
// @route   PUT /api/applications/:id/status
// @access  Private (employer)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes, interviewDate, interviewLocation, interviewType } = req.body;

    const application = await Application.findById(req.params.id)
      .populate('applicant', 'name email')
      .populate('job', 'title');

    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    if (notes !== undefined) application.notes = notes;
    if (interviewDate) application.interviewDate = interviewDate;
    if (interviewLocation) application.interviewLocation = interviewLocation;
    if (interviewType) application.interviewType = interviewType;
    await application.save();

    // Notify applicant
    const statusMessages = {
      reviewed: 'Your application has been reviewed.',
      shortlisted: 'Congratulations! You have been shortlisted.',
      interview: `You have been invited for an interview${interviewDate ? ` on ${new Date(interviewDate).toLocaleDateString()}` : ''}.`,
      offered: 'Congratulations! You have received a job offer.',
      rejected: 'Thank you for your interest. Unfortunately, your application was not selected.',
    };

    if (statusMessages[status]) {
      try {
        await sendEmail({
          to: application.applicant.email,
          subject: `Application Update: ${application.job.title}`,
          html: `
            <h2>Application Status Update</h2>
            <p>Dear ${application.applicant.name},</p>
            <p>${statusMessages[status]}</p>
            ${notes ? `<p><strong>Note:</strong> ${notes}</p>` : ''}
            <p>Log in to your dashboard for more details.</p>
          `,
        });
      } catch (_) { /* ignore email errors */ }
    }

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application (jobseeker)
// @route   PUT /api/applications/:id/withdraw
// @access  Private (jobseeker)
const withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (['offered', 'rejected'].includes(application.status)) {
      return res.status(400).json({ message: 'Cannot withdraw this application' });
    }

    application.status = 'withdrawn';
    await application.save();

    res.json({ success: true, message: 'Application withdrawn' });
  } catch (error) {
    next(error);
  }
};

module.exports = { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus, withdrawApplication };
