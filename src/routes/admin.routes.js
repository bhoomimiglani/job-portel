const express = require('express');
const router = express.Router();
const {
  getStats, getUsers, toggleUserStatus, getAllJobs, toggleFeaturedJob, updateJobStatus, deleteUser,
} = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/feature', toggleFeaturedJob);
router.put('/jobs/:id/status', updateJobStatus);

module.exports = router;
