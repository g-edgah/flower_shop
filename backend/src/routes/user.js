import express from 'express'

import { getUser, editUser } from '../controllers/user/user.js'
import { getUserCart, editCartItem, addCartItem, minusCartItem, deleteCartItem } from '../controllers/user/cart.js'
import { getUserWishlist, editWishlist } from '../controllers/user/wishlist.js'
import { getUserPaymentMethods, addPaymentMethod, removePaymentMethod, editDefaultMethod } from '../controllers/user/payment.js'
import { createOrder, addOrderReview, getUserOrders, getOrderById } from '../controllers/user/orders.js'
import { getUserVouchers } from '../controllers/user/vouchers.js'
import { getUserAddresses, addAddress, removeAddress, getRegions, getCities} from '../controllers/user/address.js'

import { verifyToken } from '../middleware/auth.js'


const userRouter = express.Router();
userRouter.use(verifyToken);

// user
userRouter.get('/:id', getUser)
userRouter.patch('/:id', editUser)

// cart
userRouter.get('/cart/:id', getUserCart)
userRouter.post('/cart/:id', addCartItem)
userRouter.patch('/cart/:id', minusCartItem)
userRouter.delete('/cart/:id/:productId', deleteCartItem)

// wishlist
userRouter.get('/wishlist/:id', getUserWishlist)
userRouter.post('/wishlist/:id', editWishlist)

// orders
userRouter.post('/orders/:id', createOrder)
userRouter.post('/orders/reviews/:id', addOrderReview)
userRouter.get('/orders/:id', getUserOrders)
userRouter.get('/orders/:id/:orderId', getOrderById)

//vouchers
userRouter.get('/vouchers/:id', getUserVouchers)

//payment methods
userRouter.get('/payment/:id', getUserPaymentMethods)
userRouter.post('/payment/add/:id', addPaymentMethod)
userRouter.post('/payment/remove/:id', removePaymentMethod)
userRouter.post('/payment/default/:id', editDefaultMethod)


// address
userRouter.get('/address/:id', getUserAddresses)
userRouter.post('/address/add/:id', addAddress)
userRouter.post('/address/remove/:id', removeAddress)
userRouter.get('/address/regions/:countryName/:id', getRegions)
userRouter.get('/address/cities/:regionName/:id', getCities)


export default userRouter