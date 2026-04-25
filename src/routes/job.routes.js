const express = require('express');
const router = express.Router();
const {
  getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs, getFeaturedJobs, getCategories,
} = require('../controllers/job.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/categories', getCategories);
router.get('/employer/my-jobs', protect, authorize('employer'), getMyJobs);
router.get('/:id', getJob);
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);

module.exports = router;
