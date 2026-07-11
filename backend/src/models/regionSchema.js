import mongoose from 'mongoose'

const regionSchema = new mongoose.Schema({
    country: {
        type: mongoose.Schema.Types.ObjectId
    },
    regionName: {
        type: String,
        required: true,
        unique: true
    },
    cities: {
        type: [String],
        required: true,
        default: []
    }
}, {
    timestamps: true,
    strict: true,
    collection: "regions"
})

const Region = mongoose.model('Region', regionSchema)


export default Region