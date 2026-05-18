import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "invalid email format"],
        maxLength: 30,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 128,
    },
    picturePath: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        maxLength: 128,
    },
    cart: {
        type: Array,
        default: [],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, { 
    timestamps: true,
    collection: 'users',
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
 })

 //password hashing middleware
 userSchema.pre('save', async function(next) {
    
    if (!this.isModified('password')) {
        console.log("unmodified")
        return next()
    }

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)

    } catch (error) {
        throw new Error(`password hashing error: ${error.message}`);
        console.log(`spassword hashing error: ${error}`)
    }
 })

 //matching password to hashed pashword
 userSchema.methods.matchPassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    }

 const User = mongoose.model('User', userSchema)
 
 export default User