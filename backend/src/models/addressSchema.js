import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    country: { 
        type: String, 
        required: true 
    }, 
    region: { 
        type: String, 
        required: true 
    },
    city: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    info: { 
        type: String, 
        required: false 
    },
    mobile: { 
        type: String, 
        required: true 
    },
    state: { 
        type: String, 
        required: false 
    },
    zipCode: { 
        type: String, 
        required: false 
    }
}, { 
    timestamps: true,
    strict: true //only allow fields specified in schema. strict: 'throw' throws an error on extra undefined fields
 });


// export the schema (not a model, since it's a subdocument)
export default addressSchema;