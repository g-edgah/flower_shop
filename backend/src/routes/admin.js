import express from 'express'

import { addProduct, removeProduct } from '../controller/admin.js'
import { verifyToken, verifyAdmin } from '../middleware/auth.js'


const userRoutes = express.Router();

userRoutes.post('/:id/addProduct', verifyAdmin, addProduct)
userRoutes.delete('/:id/removeProduct', verifyAdmin, removeProduct)

export default userRoutes