import mongoose from 'mongoose'

const regionSchema = new mongoose.Schema({
    countryName: {
        type: String,
        required: true
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