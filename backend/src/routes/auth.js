import express from 'express';

const authRouter = express.Router();

import { register, login, logout } from '../controller/auth.js'
import { verifyToken } from '../middleware/auth.js'


authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout/:id', verifyToken, logout)

export default authRouter