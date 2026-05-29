import express from 'express'

import { getUser, getUserCart, editUser, editCartItem, addCartItem, minusCartItem, deleteCartItem, getUserWishlist, editUserWishlist } from '../controller/user.js'
import { verifyToken } from '../middleware/auth.js'


const userRouter = express.Router();
userRouter.use(verifyToken);

userRouter.get('/:id', verifyToken, getUser)
userRouter.patch('/:id', verifyToken, editUser)
userRouter.get('/cart/:id', verifyToken, getUserCart)
userRouter.post('/cart/:id', verifyToken, addCartItem)
userRouter.patch('/cart/:id', verifyToken, minusCartItem)
userRouter.delete('/cart/:id/:productId', verifyToken, deleteCartItem)
userRouter.get('/wishlist/:id', verifyToken, getUserWishlist)
userRouter.post('/wishlist/:id', verifyToken, editUserWishlist)

export default userRouter