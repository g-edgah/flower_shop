import Order from '../../models/order.js';
import Counter from '../../models/counter.js';
import User from '../../models/user.js';
import Bouquet from '../../models/bouquet.js';
import Flower from '../../models/flower.js';

// Create order from cart
export const createOrder = async (req, res) => {
   
    try {
        const {id} = req.user;
        const { payment } = req.body;
        

        // get user with populated cart
        const user = await User.findById(id)
            .populate('cart.product');
        const userObject = user.toObject(); // convert to plain object for logging
        const paymentMethod = userObject.paymentMethod; 
        
        console.log("payment method: ", paymentMethod)
        console.log("create order request recieved for user: ", id)
        //console.log("Full user object:", JSON.stringify(user, null, 2));
       
        if (!user.cart.length) {
            console.log("cart empty")
            return res.status(400).json({ message: "Cart is empty" });
        }
       

        // validate all products still exist and have sufficient stock
        for (const item of user.cart) {
            let product

            if (item.product.type === 'bouquet') {
                product = await Bouquet.findById(item.product._id)
                console.log("bouquet found: ")
            } else if (item.product.type === 'flower') {
                product = await Flower.findById(item.product._id);
                //console.log("flower found: ")
            }
            // console.log("here: ", product)
            
            if (!product) {
                console.log("product not found")
                return res.status(404).json({ 
                    message: `Product ${item.product.name} no longer exists` 
                });
            }
            
            
            if (product.inStock < item.quantity) {
                console.log("checking stock")
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.inStock}` 
                });
            }
        }

        console.log("about to create order")
        // create order items from cart items
        const orderItems = user.cart.map(cartItem => ({
            product: cartItem.product._id,
            name: cartItem.product.name,
            productModel: cartItem.productModel,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            totalPrice: cartItem.product.price * cartItem.quantity
        }));

        console.log("cart123: ", user.cart)
        
        // calculate totals
        //subtotals
        const subTotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        // tax if applicable
        const tax = subTotal * 0; // 0% tax

        //shipping cost
        const region = user.address?.region?.toLowerCase() || "unknown region";

        const shippingCost = region === 'nairobi' ? 300 : 800

        //grand total
        const total = subTotal + tax + shippingCost

        //tracking no
        const counter = await Counter.findOneAndUpdate(
            { name: 'trackingNumber' },
            { $inc: { sequenceValue: 1 } },
            { returnDocument: true, upsert: true } //create if it doesn't exist
        )

        const trackingNo = counter.sequenceValue;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 2); // estimated delivery in 2 days
        
        // create order
        const order = new Order({
            user: id,
            items: orderItems,
            status: 'Pending',
            paymentMethod: paymentMethod,
            shippingAddress: user.address,
            subTotal,
            trackingNumber: trackingNo,
            tax,
            shippingCost,
            total,
            orderDate: new Date(),
            deliveryDate: deliveryDate
        });
        
        console.log("saving order: ")
        await order.save();

        console.log("order saved: ")
        
        // add order reference to user and clear cart
        const updatedUser = await User.findOneAndUpdate(
            { _id: id},
            {
                $push: { orders: order._id }, // add order reference
                $set: { cart: [] } // clear cart
            },
            { 
                runValidators: true 
            }
        );

        console.log("updating stock")
        
        // update product stock
        for (const item of orderItems) {
            if (item.productModel === 'Bouquet') {
                await Bouquet.findByIdAndUpdate(item.product, {
                    $inc: { inStock: -item.quantity }
                });
            } else if (item.productModel === 'Flower') {
                await Flower.findByIdAndUpdate(item.product, {
                    $inc: { inStock: -item.quantity }
                });
            }
            
        }
        
        res.status(201).json({
            message: "Order created successfully",
            order: order
        });
        
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: error.message });
    }
};

// get user's orders
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log("fetching orders for user: ", userId)
        
        const orders = await Order.find({ user: userId })
            .sort({ orderDate: -1 })
            .populate('items.product')
            .populate('shippingAddress');
        
        console.log("orders found: ", orders.length)
        
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

        // check if user is authorized 
        const isOwner = order.user.toString() === userId;
       
        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to view this order" });

        } else if (isOwner) {
            const order = await Order.findOne({ _id: orderId, user: userId })
                .populate('items.product');
        }    
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        res.status(200).json({ order });
        
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
        if (!isAdmin && order.status !== 'Pending') {
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


// add review/ratings
export const addOrderReview = async ( req, res) => {
    console.log("adding review")
    try {
        const { id } = req.user
        const { productRating, serviceRating, comment, productId, orderId } = req.body

        // validate ratings if provided
        if (productRating && ![1, 2, 3, 4, 5].includes(productRating)) {
            return res.status(400).json({
                success: false,
                message: 'Product rating must be between 1 and 5'
            });
        }

        if (serviceRating && ![1, 2, 3, 4, 5].includes(serviceRating)) {
            return res.status(400).json({
                success: false,
                message: 'Service rating must be between 1 and 5'
            });
        }

        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            return res.status(404).json({ 
                success: false,
                message: "Order not found" 
            });
        }

        // check if the order belongs to the user
        if (order.user.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to review this order'
            });
        }

        // check if order can be reviewed/rated
        if (order.status !== 'Delivered' ) {
            return res.status(400).json({ 
                success: false,
                message: `Cannot rate undelivered order}` 
            });
        }

        // check if order can be reviewed/rated
        // find the specific item in the order
        const itemIndex = order.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ 
                error: 'Product not found in this order' 
            });
        }

        const item = order.items[itemIndex];

        // check if item is already reviewed
        if (item.reviewStatus === 'reviewed') {
            return res.status(400).json({ 
                error: 'This item has already been reviewed. You cannot review it again.' 
            });
        }

        // preparing update object
        const updateFields = {};
        
        if (productRating !== undefined) {
            updateFields['items.$.productRating'] = productRating;
        }
        
        if (serviceRating !== undefined) {
            updateFields['items.$.serviceRating'] = serviceRating;
        }

        updateFields['items.$.reviewStatus'] = "reviewed";
        
        
        if (comment !== undefined) {
            updateFields['items.$.review'] = comment;
        }

        const updateOrder = await Order.findOneAndUpdate(
            { 
                '_id': orderId, 
                'user': id, 
                'items.product': productId
            },
            {
                $set: updateFields 
            },
            { 
                runValidators: true 
            }
        );

        console.log("review added", item)

        res.status(200).json({
            success: true,
            message: "Order reviewed successfully",
            order: order
        });


    } catch (error) {
        console.error("Error reviewing order:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to cancel order", 
            error: error.message 
        });
    }

} 