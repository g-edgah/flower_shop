import express from 'express'

import { getUser, getUserCart } from '../controller/user.js'
import { verifyToken } from '../middleware/auth.js'


const userRouter = express.Router();
userRouter.use(verifyToken);

userRouter.get('/:id', verifyToken, getUser)
userRouter.get('/cart/:id', verifyToken, getUserCart)


export default userRouter