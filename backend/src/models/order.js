import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: Date,
        default: Date.now
    },
    totalAmount: Number,
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;