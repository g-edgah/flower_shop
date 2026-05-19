import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true  // snapshot of product name at time of order
    },
    price: {
        type: Number,
        required: true  // snapshot of price at time of order
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 999
    },
    totalPrice: {
        type: Number,
        required: true  // price * quantity
    }
}, { 
    timestamps: true,
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
 });


export default orderItemSchema;