const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUser,
  deleteUser,
  createResource,
  getResources,
  deleteResource,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Public route to view resources
router.get('/resources', getResources);

// Protected Admin-only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/resources', createResource);
router.delete('/resources/:id', deleteResource);

module.exports = router;
