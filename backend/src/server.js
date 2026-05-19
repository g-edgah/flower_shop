import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieparser from 'cookie-parser'
import { fileURLToPath } from 'url';



import connectDB from './db/db.js';

import authRouter from './routes/auth.js';
import userRouter from './routes/user.js'
import productRouter from './routes/product.js'
import adminRouter from './routes/admin.js'
import homeRouter from './routes/home.js'

import { verifyToken } from './middleware/auth.js'

dotenv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: 'http://localhost:5174', 
    credentials: true,               
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());
app.use(cookieparser())

//assests
app.use('/assets', express.static(path.join(__dirname, 'assets/')))

//routes
app.use('/api/home', homeRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/admin', adminRouter)

//404
app.get('/w', (req, res) => {
    res.status(404).json({message: "page not found"})
})

//mongoose
const PORT = process.env.PORT
connectDB().then( () => {
    app.listen(PORT, () => console.log(`server connected on port ${PORT}`))
}).catch( (error) => {
    console.log(`error starting app: ${error}`)
})

