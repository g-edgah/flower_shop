import express from 'express';

const authRouter = express.Router();

import { register, login } from '../controller/auth.js'


authRouter.post('/login', login)
authRouter.post('/register', register)

export default authRouter