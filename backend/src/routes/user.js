import express from 'express'

import { getUser, getUserCart } from '../controller/user.js'
import { verifyToken } from '../middleware/auth.js'


const userRoutes = express.Router();

userRoutes.get('/:id', verifyToken, getUser)

export default userRoutes