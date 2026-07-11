import mongoose from 'mongoose'

const countrySchema = new mongoose.Schema({
    countryName: {
        type: String,
        default: "Kenya",
        required: true,
        unique: true
    },
    regions: {
        type: [String],
        required: true,
        default: []
    }
}, {
    timestamps: true,
    strict: true,
    collection: "countries"
})

 const Country = mongoose.model('Country', countrySchema)
 

 export default Country