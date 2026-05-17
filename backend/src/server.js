import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


import connectDB from './db/db.js';

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("niaje kastoma")
})


const PORT = process.env.PORT
connectDB().then( () => {
    app.listen(PORT, () => console.log(`server connected on port ${PORT}`))
}).catch( (error) => {
    console.log(`error starting app: ${error}`)
})

