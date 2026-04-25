const express = require('express');
const router = express.Router();
const {
  applyForJob, getMyApplications, getJobApplications, updateApplicationStatus, withdrawApplication,
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/:jobId', protect, authorize('jobseeker'), upload.single('resume'), applyForJob);
router.get('/my-applications', protect, authorize('jobseeker'), getMyApplications);
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);
router.put('/:id/withdraw', protect, authorize('jobseeker'), withdrawApplication);

module.exports = router;
