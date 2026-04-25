const express = require('express');
const router = express.Router();
const { updateProfile, changePassword, toggleSaveJob, getSavedJobs, getEmployerProfile } = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.put(
  '/profile',
  protect,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'companyLogo', maxCount: 1 },
  ]),
  updateProfile
);
router.put('/change-password', protect, changePassword);
router.post('/saved-jobs/:jobId', protect, authorize('jobseeker'), toggleSaveJob);
router.get('/saved-jobs', protect, authorize('jobseeker'), getSavedJobs);
router.get('/employer/:id', getEmployerProfile);

module.exports = router;
