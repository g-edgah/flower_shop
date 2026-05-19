import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/orders.js';

const orderRouter = express.Router();

// user routes (protected)
orderRouter.post('/create', verifyToken, createOrder);
orderRouter.get('/my-orders', verifyToken, getUserOrders);
orderRouter.get('/:orderId', verifyToken, getOrderById);

// admin routes (with additional admin middleware)
orderRouter.put('/:orderId/status', verifyAdmin, updateOrderStatus);


export default orderRouter;