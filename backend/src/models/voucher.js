import mongoose from 'mongoose';

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    
    // discount: percentage or fixed amount
    discountType: {
        type: String,
        enum: ['percentage', 'fixed', 'free_shipping'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    
    // restrictions
    minimumOrderAmount: {
        type: Number,
        default: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: null
    },
    
    // usage limits
    usageLimit: {
        type: Number,
        default: 1
    },
    usedCount: {
        type: Number,
        default: 0
    },
    perUserLimit: {
        type: Number,
        default: 1
    },
    
    // date range
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    
    // status
    isActive: {
        type: Boolean,
        default: true
    },

        // user restrictions
    applicableTo: {
        type: String,
        enum: ['all', 'new_users', 'existing_users', 'specific_users'],
        default: 'all'
    },
    applicableUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    
    // track usage
    usedBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        },
        usedAt: {
            type: Date,
            default: Date.now
        },
        discountAmount: Number,
        orderAmount: Number
    }]

}, {
    timestamps: true
});

// methods
voucherSchema.methods.isValid = function() {
    const now = new Date();
    return this.isActive && 
           this.startDate <= now && 
           this.endDate >= now &&
           (this.usageLimit === null || this.usedCount < this.usageLimit);
};

voucherSchema.methods.calculateDiscount = function(orderTotal) {
    if (!this.isValid() || orderTotal < this.minimumOrderAmount) {
        return 0;
    }
    
    let discount = this.discountType === 'percentage' 
        ? (orderTotal * this.discountValue) / 100 
        : this.discountValue;
    
    if (this.maxDiscountAmount) {
        discount = Math.min(discount, this.maxDiscountAmount);
    }
    
    return Math.min(discount, orderTotal);
};

const Voucher = mongoose.model('Voucher', voucherSchema);


export default Voucher