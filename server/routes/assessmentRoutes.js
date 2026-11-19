const express = require('express');
const router = express.Router();
const {
  getQuestions,
  submitAssessment,
  getHistory,
  getLatest,
  getAssessmentById,
  compareAssessments,
} = require('../controllers/assessmentController');
const { protect } = require('../middleware/auth');

router.get('/questions', getQuestions);
router.post('/', protect, submitAssessment);
router.get('/history', protect, getHistory);
router.get('/latest', protect, getLatest);
router.get('/:id', protect, getAssessmentById);
router.get('/compare/:id1/:id2', protect, compareAssessments);

module.exports = router;
