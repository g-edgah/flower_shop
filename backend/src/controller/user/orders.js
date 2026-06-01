import Order from '../../models/order.js';
import User from '../../models/user.js';
import Product from '../../models/product.js';

// Create order from cart
export const createOrder = async (req, res) => {
    try {
        const {id} = req.user;
        const { paymentMethod, shippingAddress } = req.body;
        
        // get user with populated cart
        const user = await User.findById(id)
            .populate('cart.product');
        
        console.log("user payment info: ", user.paymentMethod)
        
        if (!user.cart.length) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // validate all products still exist and have sufficient stock
        for (const item of user.cart) {
            const product = await Product.findById(item.product._id);
            
            if (!product) {
                return res.status(404).json({ 
                    message: `Product ${item.product.name} no longer exists` 
                });
            }
            
            if (product.inStock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.inStock}` 
                });
            }
        }

        
        // create order items from cart items
        const orderItems = user.cart.map(cartItem => ({
            product: cartItem.product._id,
            name: cartItem.product.name,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            size: cartItem.size,
            color: cartItem.color,
            totalPrice: cartItem.product.price * cartItem.quantity
        }));
        
        // calculate totals
        //subtotals
        const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        // tax if applicable
        const tax = subtotal * 0; // 0% tax

        //shipping cost
        const region = user.address?.region?.toLowerCase() || "unknown region";

        const shippingCost = region === 'nairobi' ? 300 : 800

        //grand total
        const total = subTotal + tax + shippingCost
        
        // create order
        const order = new Order({
            user: id,
            items: orderItems,
            status: 'pending',
            paymentMethod: user.paymentMethod,
            shippingAddress: user.address,
            subtotal,
            tax,
            shippingCost,
            total,
            orderDate: new Date()
        });
        
        await order.save();
        
        // add order reference to user and clear cart
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $push: { orders: order._id }, // add order reference
                $set: { cart: [] } // clear cart
            },
            { 
                runValidators: true 
            }
        );
        
        // update product stock (optional)
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { inStock: -item.quantity }
            });
        }
        
        res.status(201).json({
            message: "Order created successfully",
            order: order
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get user's orders
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const orders = await Order.find({ user: userId })
            .sort({ orderDate: -1 })
            .populate('items.product');
        
        res.status(200).json({
            orders: orders,
            count: orders.length
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get single order by ID
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        
        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate('items.product');
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json({ order });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update order status (admin only)
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

// delete order
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // find the order
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Order not found" 
            });
        }

        // check if user is authorized to delete this order
        const isOwner = order.user.toString() === userId;
        const isAdmin = userRole === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ 
                success: false,
                message: "You are not authorized to delete this order" 
            });
        }

        // check if order can be deleted (only pending orders or admins)
        if (!isAdmin && order.status !== 'pending') {
            return res.status(400).json({ 
                success: false,
                message: "Can only delete pending orders. Contact support for assistance." 
            });
        }

        // remove order reference from user
        await User.findByIdAndUpdate(order.user, {
            $pull: { orders: orderId }
        });

        // delete the order
        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            deletedOrderId: orderId
        });

    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to delete order", 
            error: error.message 
        });
    }
};

// cancel order
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ _id: orderId, user: userId });
        
        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Order not found" 
            });
        }

        // check if order can be cancelled
        if (order.status !== 'pending' && order.status !== 'processing') {
            return res.status(400).json({ 
                success: false,
                message: `Cannot cancel order with status: ${order.status}` 
            });
        }

        // update order status instead of deleting
        order.status = 'cancelled';
        order.cancelledAt = new Date();
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: order
        });

    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to cancel order", 
            error: error.message 
        });
    }
};