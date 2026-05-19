import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/orders.js';

const router = express.Router();

// User routes (protected)
router.post('/create', verifyToken, createOrder);
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/:orderId', verifyToken, getOrderById);

// Admin routes (with additional admin middleware)
router.put('/:orderId/status', verifyAdmin, updateOrderStatus);


export default router;