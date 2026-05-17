import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 30,
    },
    description: {
        type: String,
        required: true,
        min: 2,
        max: 300,
    },
    price: {
        type: Number,
        required: true,
    },
    picturePath: {
        type: String,
        default: '',
    },
    popularity: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        required: true,
    },
    colors: {
        type: Array,
        default: [],
    },
    category: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    new: {
        type: Boolean,
        default: false,
    },
    floristPick: {
        type: Boolean,
        default: false,
    }

}, { 
    timestamps: true,
    collection: 'products',
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
})


const Product = mongoose.model('Product', productSchema)
 

export default Product
