import express from 'express'

import { getHomeData } from '../controller/user/home.js'
import { verifyToken } from '../middleware/auth.js'


const homeRouter = express.Router();

homeRouter.get('/', getHomeData);


export default homeRouter