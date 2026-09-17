import express from 'express';
import {
  createPaymentIntent,
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Payment Intent endpoint
router.post('/create-payment-intent', protect, createPaymentIntent);

// Order CRUD endpoints
router
  .route('/')
  .post(protect, createOrder);

router.get('/myorders', protect, getMyOrders);

router
  .route('/:id')
  .get(protect, getOrderById);

router.put('/:id/pay', protect, updateOrderToPaid);

export default router;
