import mongoose from 'mongoose';


const passwordItemSchema = new mongoose.Schema({
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isTemporary: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        default: null // null means never expires
    },
    lastUsedAt: {
        type: Date,
        default: null
    },

    // password strength metrics
    strength: {
        score: {
            type: Number,
            min: 0,
            max: 4
        },
        feedback: {
            type: String
        }
    },

    // for audit trail
    changedFrom: {
        type: String, // hash of previous password
        default: null
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    changeReason: {
        type: String,
        enum: ['user_initiated', 'admin_initiated', 'reset', 'system', 'expired'],
        default: 'user_initiated'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    // for password history tracking
    oldPasswords: {
        type: Array,
        default: []
    },
    isCompromised: {
        type: Boolean,
        default: false
    },
    compromisedAt: {
        type: Date,
        default: null
    }
    
}, {
    timestamps: true,
    strict: true
});

// Indexes
passwordItemSchema.index({ isActive: 1 });
passwordItemSchema.index({ expiresAt: 1 });

export default passwordItemSchema