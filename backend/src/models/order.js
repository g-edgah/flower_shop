import mongoose from 'mongoose';

import orderItemSchema from './orderSchema.js';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // payment info
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'cash_on_delivery'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
        paymentId: {
        type: String  // Mpesa/PayPal transaction ID
    },

    // shipping info
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    },

    // order totals
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true,
        default: 0
    },
    shippingCost: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true  // subtotal + tax + shipping - discount
    },

    // tracking info
    trackingNumber: {
        type: String,
        default: ''
    },
    estimatedDelivery: {
        type: Date
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true  // adds createdAt and updatedAt
});

//calculate order totals
orderSchema.methods.calculateTotals = function() {
    this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    this.total = this.subtotal + this.tax + this.shippingCost - this.discount;
    return this.total;
};

//static method to get user's order history
orderSchema.statics.getUserOrders = function(userId, limit = 10) {
    return this.find({ user: userId })
        .sort({ orderDate: -1 })
        .limit(limit)
        .populate('items.product');
};

const Order = mongoose.model('Order', orderSchema);


export default Order;