import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import cartItemSchema from './cartItemSchema.js'
import wishlistItemSchema from './wishlistItemSchema.js'
import addressSchema from './addressSchema.js'


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    userName: {
        type: String,
        required: false,
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
    mobile: {
        type: String,
        required: false,
        trim: true,
        match: [/^\d{10}$/, "invalid mobile number"],
    },
    paymentMethods: {
        card: {
            type: Object,
            required: false,
        },
        mpesa: {
            type: Object,
            required: false,
        },
    },
    cart: [cartItemSchema],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'   
    }],
    wishlist: [wishlistItemSchema],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    address: addressSchema,
}, { 
    timestamps: true,
    collection: 'users',
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
 })



 // password hashing middleware
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



 // matching password to hashed pashword
 userSchema.methods.matchPassword = async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password)
    }

 // method to get user's complete order history
 userSchema.methods.getOrderHistory = async function() {
    await this.populate({
        path: 'orders',
        options: { sort: { orderDate: -1 } },
        populate: {
            path: 'items.product',
            select: 'name images'
        }
    });
    return this.orders;
 };

 const User = mongoose.model('User', userSchema)
 

 export default User