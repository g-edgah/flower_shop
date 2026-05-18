import mongoose from 'mongoose'
import dotenv from 'dotenv'

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log("mongodb connected successfully")

    } catch(error) {
        console.log(`error while connecting to mongodb: ${error}`)
        process.exit(1) //failure
    }
}

export default connectDB