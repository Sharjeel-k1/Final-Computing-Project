import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createOrder, getOrders, updateOrderStatus, getAllOrders } from '../controllers/orderController.js';

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, createOrder);

// Get all orders for the logged-in user
router.get('/', authMiddleware, getOrders);

// Get all orders (admin only)
router.get('/all', authMiddleware, getAllOrders);

// Update order status
router.put('/:id/status', authMiddleware, updateOrderStatus);

export default router;
