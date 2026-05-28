import express from 'express'

import { getUser, getUserCart, editUser, editCartItem, addCartItem, deleteCartItem } from '../controller/user.js'
import { verifyToken } from '../middleware/auth.js'


const userRouter = express.Router();
userRouter.use(verifyToken);

userRouter.get('/:id', verifyToken, getUser)
userRouter.get('/cart/:id', verifyToken, getUserCart)
userRouter.patch('/:id', verifyToken, editUser)
userRouter.patch('/cart/:id', verifyToken, editCartItem)
userRouter.post('/cart/:id', verifyToken, addCartItem)
userRouter.delete('/cart/:id', verifyToken, deleteCartItem)

export default userRouter