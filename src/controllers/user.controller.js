const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'phone', 'location', 'bio', 'skills', 'experience', 'education',
      'companyName', 'companyWebsite', 'companyDescription', 'companySize', 'industry',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (req.files) {
      if (req.files.avatar) updates.avatar = req.files.avatar[0].path.replace(/\\/g, '/');
      if (req.files.resume) updates.resume = req.files.resume[0].path.replace(/\\/g, '/');
      if (req.files.companyLogo) updates.companyLogo = req.files.companyLogo[0].path.replace(/\\/g, '/');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Save / unsave a job
// @route   POST /api/users/saved-jobs/:jobId
// @access  Private (jobseeker)
const toggleSaveJob = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;

    const isSaved = user.savedJobs.includes(jobId);
    if (isSaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.savedJobs.push(jobId);
    }
    await user.save();

    res.json({ success: true, saved: !isSaved, savedJobs: user.savedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (jobseeker)
const getSavedJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      populate: { path: 'employer', select: 'companyName companyLogo' },
    });
    res.json({ success: true, jobs: user.savedJobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employer public profile
// @route   GET /api/users/employer/:id
// @access  Public
const getEmployerProfile = async (req, res, next) => {
  try {
    const employer = await User.findOne({ _id: req.params.id, role: 'employer' }).select(
      'name companyName companyLogo companyWebsite companyDescription companySize industry location createdAt'
    );
    if (!employer) return res.status(404).json({ message: 'Employer not found' });

    const jobs = await Job.find({ employer: req.params.id, status: 'active' }).sort('-createdAt').limit(10);
    res.json({ success: true, employer, jobs });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, changePassword, toggleSaveJob, getSavedJobs, getEmployerProfile };
