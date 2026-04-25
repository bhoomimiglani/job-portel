const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.post('/resume', protect, upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ success: true, path: req.file.path.replace(/\\/g, '/') });
});

router.post('/avatar', protect, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ success: true, path: req.file.path.replace(/\\/g, '/') });
});

module.exports = router;
