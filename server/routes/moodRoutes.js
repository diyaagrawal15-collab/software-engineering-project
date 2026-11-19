const express = require('express');
const router = express.Router();
const {
  createEntry,
  getEntries,
  getMoodTrends,
  updateEntry,
  deleteEntry,
} = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createEntry);
router.get('/', protect, getEntries);
router.get('/trends', protect, getMoodTrends);
router.put('/:id', protect, updateEntry);
router.delete('/:id', protect, deleteEntry);

module.exports = router;
