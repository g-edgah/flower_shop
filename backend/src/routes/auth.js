import express from 'express';

const authRoutes = express.Router();

import { register, login } from '../controller/auth.js'


authRoutes.post('/login', login)
authRoutes.post('/register', register)

export default authRoutes