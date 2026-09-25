import express from 'express';
import { getAdminStats, getAdminAnalytics } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin stats endpoint
router.get('/stats', protect, admin, getAdminStats);

// Admin analytics endpoint
router.get('/analytics', protect, admin, getAdminAnalytics);

export default router;

