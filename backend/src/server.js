import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';


import connectDB from './db/db.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js'
import productRoutes from './routes/product.js'

import { verifyToken } from './middleware/auth.js'

dotenv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("niaje kastoma")
})

app.use('/assets', express.static(path.join(__dirname, 'assets/')))

//routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)

//mongoose
const PORT = process.env.PORT
connectDB().then( () => {
    app.listen(PORT, () => console.log(`server connected on port ${PORT}`))
}).catch( (error) => {
    console.log(`error starting app: ${error}`)
})

