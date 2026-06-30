import express from 'express'

import { getUser, editUser, editUserPassword } from '../controllers/user/user.js'
import { getUserCart, editCartItem, addCartItem, minusCartItem, deleteCartItem } from '../controllers/user/cart.js'
import { getUserWishlist, editWishlist } from '../controllers/user/wishlist.js'
import { createOrder, addOrderReview, getUserOrders, getOrderById } from '../controllers/user/orders.js'
import { getUserVouchers } from '../controllers/user/vouchers.js'
import { verifyToken } from '../middleware/auth.js'


const userRouter = express.Router();
userRouter.use(verifyToken);

// user
userRouter.get('/:id', verifyToken, getUser)
userRouter.patch('/:id', verifyToken, editUser)
userRouter.patch('password/:id', verifyToken, editUserPassword)
userRouter.patch('email/:id', verifyToken, editUserPassword)

// cart
userRouter.get('/cart/:id', verifyToken, getUserCart)
userRouter.post('/cart/:id', verifyToken, addCartItem)
userRouter.patch('/cart/:id', verifyToken, minusCartItem)
userRouter.delete('/cart/:id/:productId', verifyToken, deleteCartItem)

// wishlist
userRouter.get('/wishlist/:id', verifyToken, getUserWishlist)
userRouter.post('/wishlist/:id', verifyToken, editWishlist)

// orders
userRouter.post('/orders/:id', verifyToken, createOrder)
userRouter.post('/orders/reviews/:id', verifyToken, addOrderReview)
userRouter.get('/orders/:id', verifyToken, getUserOrders)
userRouter.get('/orders/:id/:orderId', verifyToken, getOrderById)

//vouchers
userRouter.get('/vouchers/:id', verifyToken, getUserVouchers)


export default userRouter