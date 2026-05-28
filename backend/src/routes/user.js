import express from 'express'

import { getUser, getUserCart, editUser, editCartItem, deleteCartItem, getUserWishlist, editUserWishlist } from '../controller/user.js'
import { verifyToken } from '../middleware/auth.js'


const userRouter = express.Router();
userRouter.use(verifyToken);

userRouter.get('/:id', verifyToken, getUser)
userRouter.get('/cart/:id', verifyToken, getUserCart)
userRouter.get('/wishlist/:id', verifyToken, getUserWishlist)
userRouter.patch('/:id', verifyToken, editUser)
userRouter.post('/cart/:id', verifyToken, editCartItem)
userRouter.delete('/cart/:id', verifyToken, deleteCartItem)
userRouter.post('/wishlist/:id', verifyToken, editUserWishlist)

export default userRouter