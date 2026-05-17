import express from 'express'

const userRoutes = express.Router();

import { getUser } from '../controller/user.js'

userRoutes.get('/:id', getUser)

export default userRoutes