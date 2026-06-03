import mongoose from "mongoose";

import './bouquet.js';  
import './flower.js';

const wishlistItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Product ID is required'],
        //ref: 'Bouquet' 
        refPath: 'wishlist.productModel' 
    },
    productModel: {
        type: String,
        required: true,
        enum: ['Bouquet', 'Flower']  // This validates the model name
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
export default wishlistItemSchema;