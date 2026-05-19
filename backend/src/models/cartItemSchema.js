import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
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
});


// export the schema (not a model, since it's a subdocument)
export default cartItemSchema;