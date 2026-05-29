import mongoose from "mongoose";

import './bouquet.js';  
import './flower.js';

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Product ID is required'],
        //ref: 'Bouquet' 
        refPath: 'cart.productModel' 
    },
    productModel: {
        type: String,
        required: true,
        enum: ['Bouquet', 'Flower']  // This validates the model name
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        max: [999, 'Quantity cannot exceed 999'],
        default: 1
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true,
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
 });


// export the schema (not a model, since it's a subdocument)
export default cartItemSchema;