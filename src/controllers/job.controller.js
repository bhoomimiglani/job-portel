const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs (with filters)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      search, location, jobType, category, experienceLevel,
      salaryMin, salaryMax, page = 1, limit = 10, sort = '-createdAt',
    } = req.query;

    const query = { status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (category) query.category = { $regex: category, $options: 'i' };
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (salaryMin) query.salaryMin = { $gte: Number(salaryMin) };
    if (salaryMax) query.salaryMax = { $lte: Number(salaryMax) };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'companyName companyLogo')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      jobs,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'employer',
      'name companyName companyLogo companyWebsite companyDescription companySize industry location'
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Increment views
    job.views += 1;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (employer)
const createJob = async (req, res, next) => {
  try {
    const jobData = {
      ...req.body,
      employer: req.user._id,
      companyName: req.user.companyName || req.body.companyName,
      companyLogo: req.user.companyLogo || '',
    };

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (employer - own jobs)
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (employer - own jobs / admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ job: req.params.id });

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer's own jobs
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (employer)
const getMyJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { employer: req.user._id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query).sort('-createdAt').skip(skip).limit(Number(limit));

    res.json({
      success: true,
      jobs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured jobs
// @route   GET /api/jobs/featured
// @access  Public
const getFeaturedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'active', isFeatured: true })
      .populate('employer', 'companyName companyLogo')
      .sort('-createdAt')
      .limit(6);
    res.json({ success: true, jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job categories with counts
// @route   GET /api/jobs/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Job.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs, getFeaturedJobs, getCategories };
