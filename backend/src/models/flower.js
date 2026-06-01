import mongoose from 'mongoose'

const flowerSchema = new mongoose.Schema({
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
    },
    inStock: {
        type: Number,
        required: true,
        default: 0,
    },

}, { 
    timestamps: true,
    collection: 'flowers',
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
})

const Flower = mongoose.model('Flower', flowerSchema)

 
export default Flower
