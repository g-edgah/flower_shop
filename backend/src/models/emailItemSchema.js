// models/EmailItem.js or inside user model
const emailItemSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        unique: true,
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
    isPrimary: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    // For audit trail
    changedFrom: {
        type: String,
        trim: true,
        lowercase: true
    },
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

// Index for faster lookups
emailItemSchema.index({ email: 1 });
emailItemSchema.index({ verificationToken: 1 });
emailItemSchema.index({ isPrimary: 1 });

export default emailItemSchema