

// update order status 
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, trackingNumber } = req.body;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        
        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }
        
        await order.save();
        
        res.status(200).json({
            message: "Order status updated",
            order
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};