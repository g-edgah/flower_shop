import express from 'express'

import { addProduct, removeProduct } from '../controller/admin.js'
import { verifyToken } from '../middleware/auth.js'


const userRoutes = express.Router();

userRoutes.get('/:id', verifyToken, addProduct)
userRoutes.get('/:id/', verifyToken, removeProduct)

export default userRoutes