const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalJobs, totalApplications, activeJobs, employers, jobseekers] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'employer' }),
      User.countDocuments({ role: 'jobseeker' }),
    ]);

    const recentJobs = await Job.find().sort('-createdAt').limit(5).populate('employer', 'companyName');
    const recentUsers = await User.find().sort('-createdAt').limit(5).select('name email role createdAt');

    res.json({
      success: true,
      stats: { totalUsers, totalJobs, totalApplications, activeJobs, employers, jobseekers },
      recentJobs,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip(skip).limit(Number(limit));

    res.json({
      success: true,
      users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot deactivate admin' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (admin)
// @route   GET /api/admin/jobs
// @access  Private (admin)
const getAllJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
    ];

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name email companyName')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      jobs,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle job featured status
// @route   PUT /api/admin/jobs/:id/feature
// @access  Private (admin)
const toggleFeaturedJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    job.isFeatured = !job.isFeatured;
    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status (admin)
// @route   PUT /api/admin/jobs/:id/status
// @access  Private (admin)
const updateJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });

    await User.findByIdAndDelete(req.params.id);
    await Job.deleteMany({ employer: req.params.id });
    await Application.deleteMany({ $or: [{ applicant: req.params.id }, { employer: req.params.id }] });

    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getUsers, toggleUserStatus, getAllJobs, toggleFeaturedJob, updateJobStatus, deleteUser };
