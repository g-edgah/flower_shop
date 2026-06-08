import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Product ID is required'],
        //ref: 'Bouquet' },
        refPath: 'items.productModel' 
    },
    productModel: {
        type: String,
        required: true,
        enum: ['Bouquet', 'Flower']  // This validates the model name
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
    },

    // rating
    productRating: {
        type: Number,
        enum: [ 1, 2, 3, 4, 5 ]
    },
    serviceRating: {
        type: Number,
        enum: [ 1, 2, 3, 4, 5 ]
    },

    // comment
    review: {
        type: String,
        default: ''
    },

    //review status
    reviewStatus: {
        type: String,
        enum: ["reviewed", "notReviewed"],
        default: "notReviewed"
    }
}, { 
    timestamps: true,
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
 });


export default orderItemSchema;