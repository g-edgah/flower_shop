import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

import cartItemSchema from './cartItemSchema.js'
import wishlistItemSchema from './wishlistItemSchema.js'
import voucherItemSchema from './voucher.js'
import addressSchema from './addressSchema.js'
import emailItemSchema from './emailItemSchema.js'
import passwordItemSchema from './passwordItemSchema.js'


const DeletedUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    reason: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    deletionDate: {
        type: Date,
        default: Date.now,
    },


    // mobile: {
    //     type: String,
    //     required: false,
    //     trim: true,
    //     match: [/^\d{10}$/, "invalid mobile number"],
    // },
    // paymentMethods: {
    //     card: {
    //         type: Object,
    //         required: false,
    //     },
    //     mpesa: {
    //         type: Object,
    //         required: false,
    //     },
    // },
    // cart: [cartItemSchema],
    // wishlist: [wishlistItemSchema],
    // address: addressSchema,

 }, { 
    timestamps: true,
    collection: 'deletedUsers',
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
 })


 const DeletedUser = mongoose.model('DeletedUser', DeletedUserSchema)
 

 export default DeletedUser