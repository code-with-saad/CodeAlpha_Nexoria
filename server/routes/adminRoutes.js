import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin stats endpoint
router.get('/stats', protect, admin, getAdminStats);

export default router;
