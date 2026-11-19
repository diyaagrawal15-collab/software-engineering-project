const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  getPersonalizedRecommendations,
  getRecommendationById,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.get('/', getRecommendations);
router.get('/personalized', protect, getPersonalizedRecommendations);
router.get('/:id', getRecommendationById);

module.exports = router;
