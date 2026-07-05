import express from 'express';

const authRouter = express.Router();

import { register, login, logout, editUserPassword, editUserEmail, deleteUser } from '../controllers/auth.js'
import { verifyToken } from '../middleware/auth.js'


authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/logout/:id', verifyToken, logout)
authRouter.post('/password/:id', verifyToken, editUserPassword)
authRouter.post('/email/:id', verifyToken, editUserEmail)
authRouter.post('/delete/:id', verifyToken, deleteUser)

export default authRouter