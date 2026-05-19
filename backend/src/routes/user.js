import express from 'express'

import { getUser } from '../controller/user.js'
import { verifyToken } from '../middleware/auth.js'


const userRoutes = express.Router();

userRoutes.get('/:id', verifyToken, getUser)


export default userRoutes