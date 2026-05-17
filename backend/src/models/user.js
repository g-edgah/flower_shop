import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 30,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 128,
    },
    picturePath: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        max: 128,
    },
    cart: {
        type: Array,
        default: [],
    }
}, { 
    timestamps: true,
    collection: 'users',
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
 })

 const User = mongoose.model('User', userSchema)
 
 export default User