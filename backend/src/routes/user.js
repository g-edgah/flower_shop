import express from 'express'

import { getUser, getUserCart, editUser, editUserCart } from '../controller/user.js'
import { verifyToken } from '../middleware/auth.js'


const userRouter = express.Router();
userRouter.use(verifyToken);

userRouter.get('/:id', verifyToken, getUser)
userRouter.get('/cart/:id', verifyToken, getUserCart)
userRouter.put('/:id', verifyToken, editUser)
userRouter.put('/cart/:id', verifyToken, editUserCart)

export default userRouter