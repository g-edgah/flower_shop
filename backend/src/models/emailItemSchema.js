import mongoose from 'mongoose';


const emailItemSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },

    //to maybe be reset after the new email is verified
    previousEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    verificationTokenExpiry: {
        type: Date,
        default: null
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    // isPrimary: {
    //     type: Boolean,
    //     default: true
    // },
    // // For audit trail
    // changedFrom: {
    //     type: String,
    //     trim: true,
    //     lowercase: true
    // },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    changeReason: {
        type: String,
        enum: ['user_initiated', 'admin_initiated', 'system', 'verification'],
        default: 'user_initiated'
    }
}, {
    timestamps: true,
    strict: true
});

// // Index for faster lookups
// emailItemSchema.index({ email: 1 });
// emailItemSchema.index({ verificationToken: 1 });
// emailItemSchema.index({ isPrimary: 1 });

export default emailItemSchema