import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        trim: true,
        minLength: 2,
        maxLength: 30,
    },
    lastName: {
        type: String,
        trim: true,
        minLength: 2,
        maxLength: 30,
        required: false,
    },
    country: { 
        type: String,
        required: false  
    }, 
    region: { 
        type: String, 
        required: false
    },
    city: { 
        type: String, 
        required: false 
    },
    address: { 
        type: String, 
        required: false 
    },
    info: { 
        type: String, 
        required: false 
    },
    mobile: { 
        type: String, 
        required: false  
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