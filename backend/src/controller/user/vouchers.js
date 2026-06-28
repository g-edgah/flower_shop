import User from "../../models/user.js";
import Voucher from "../../models/voucher.js";
import Order from "../../models/order.js";
import Bouquet from "../../models/bouquet.js";
import Flower from "../../models/flower.js";


export const getUserVouchers = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // // Get user's cart total if they have items
        // const cart = await Cart.findOne({ userId });
        // const orderTotal = cart?.items?.reduce((total, item) => {
        //     return total + (item.price * item.quantity);
        // }, 0) || 0;
        
        // Get all valid vouchers
        const validVouchers = await Voucher.findValidForUser(userId, orderTotal);
        
        // Get vouchers the user has already used
        const usedVoucherIds = await Voucher.distinct('_id', {
            'usedBy.userId': userId
        });
        
        // Format response
        const formattedVouchers = validVouchers.map(voucher => ({
            id: voucher._id,
            code: voucher.code,
            name: voucher.name,
            description: voucher.description,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            minimumOrderAmount: voucher.minimumOrderAmount,
            maxDiscountAmount: voucher.maxDiscountAmount,
            startDate: voucher.startDate,
            endDate: voucher.endDate,
            isUsed: usedVoucherIds.includes(voucher._id),
            usedCount: voucher.usedBy.filter(u => u.userId.toString() === userId).length,
            remainingUses: voucher.perUserLimit - voucher.usedBy.filter(u => u.userId.toString() === userId).length,
            stackable: voucher.stackable,
            // Calculate estimated discount for current cart
            estimatedDiscount: voucher.calculateDiscount(orderTotal)
        }));
        
        // Separate available and used vouchers
        const availableVouchers = formattedVouchers.filter(v => 
            !v.isUsed && v.remainingUses > 0
        );
        const usedVouchers = formattedVouchers.filter(v => 
            v.isUsed || v.remainingUses <= 0
        );
        
        res.status(200).json({
            success: true,
            count: availableVouchers.length,
            data: {
                available: availableVouchers
            }
        });
        
    } catch (error) {
        console.error('Error fetching user vouchers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vouchers',
            error: error.message
        });
    }
};

// // @desc    Get a single voucher by code
// // @route   GET /api/vouchers/:code
// // @access  Private
// const getVoucherByCode = async (req, res) => {
//     try {
//         const { code } = req.params;
//         const userId = req.user.userId;
        
//         // Get user's cart
//         const cart = await Cart.findOne({ userId });
//         const orderTotal = cart?.items?.reduce((total, item) => {
//             return total + (item.price * item.quantity);
//         }, 0) || 0;
        
//         // Find voucher
//         const voucher = await Voucher.findOne({
//             code: code.toUpperCase(),
//             isActive: true,
//             isDeleted: false
//         });
        
//         if (!voucher) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Voucher not found'
//             });
//         }
        
//         // Check if voucher is valid
//         const validation = await Voucher.validateVoucher(
//             code,
//             userId,
//             orderTotal,
//             cart?.items || []
//         );
        
//         if (!validation.valid) {
//             return res.status(400).json({
//                 success: false,
//                 message: validation.message,
//                 voucher: {
//                     id: voucher._id,
//                     code: voucher.code,
//                     name: voucher.name,
//                     description: voucher.description
//                 }
//             });
//         }
        
//         // Calculate discount
//         const discount = voucher.calculateDiscount(orderTotal, cart?.items || []);
        
//         res.status(200).json({
//             success: true,
//             data: {
//                 voucher: {
//                     id: voucher._id,
//                     code: voucher.code,
//                     name: voucher.name,
//                     description: voucher.description,
//                     discountType: voucher.discountType,
//                     discountValue: voucher.discountValue,
//                     minimumOrderAmount: voucher.minimumOrderAmount,
//                     maxDiscountAmount: voucher.maxDiscountAmount,
//                     startDate: voucher.startDate,
//                     endDate: voucher.endDate,
//                     stackable: voucher.stackable
//                 },
//                 discount,
//                 orderTotal,
//                 finalTotal: orderTotal - discount
//             }
//         });
        
//     } catch (error) {
//         console.error('Error fetching voucher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch voucher',
//             error: error.message
//         });
//     }
// };

// // @desc    Apply voucher to cart/order
// // @route   POST /api/vouchers/apply
// // @access  Private
// const applyVoucher = async (req, res) => {
//     try {
//         const { code, orderId } = req.body;
//         const userId = req.user.userId;
        
//         if (!code) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher code is required'
//             });
//         }
        
//         // Get cart or order
//         let orderTotal = 0;
//         let orderItems = [];
        
//         if (orderId) {
//             // If applying to existing order
//             const order = await Order.findOne({ 
//                 _id: orderId, 
//                 userId,
//                 status: 'pending'
//             });
            
//             if (!order) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Order not found'
//                 });
//             }
            
//             orderTotal = order.totalAmount;
//             orderItems = order.items;
//         } else {
//             // Apply to current cart
//             const cart = await Cart.findOne({ userId }).populate('items.productId');
            
//             if (!cart || cart.items.length === 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Cart is empty'
//                 });
//             }
            
//             orderTotal = cart.items.reduce((total, item) => {
//                 return total + (item.productId.price * item.quantity);
//             }, 0);
//             orderItems = cart.items;
//         }
        
//         // Validate voucher
//         const validation = await Voucher.validateVoucher(
//             code,
//             userId,
//             orderTotal,
//             orderItems
//         );
        
//         if (!validation.valid) {
//             return res.status(400).json({
//                 success: false,
//                 message: validation.message
//             });
//         }
        
//         const voucher = validation.voucher;
        
//         // Calculate discount
//         const discount = voucher.calculateDiscount(orderTotal, orderItems);
//         const finalTotal = orderTotal - discount;
        
//         // Apply voucher to cart/order
//         if (orderId) {
//             // Update order
//             await Order.findByIdAndUpdate(orderId, {
//                 voucherId: voucher._id,
//                 voucherCode: voucher.code,
//                 voucherDiscount: discount,
//                 totalAmount: finalTotal,
//                 // Store voucher usage
//                 voucherApplied: {
//                     code: voucher.code,
//                     discount: discount,
//                     appliedAt: new Date()
//                 }
//             });
//         } else {
//             // Store in session/cart for later use
//             await Cart.findOneAndUpdate(
//                 { userId },
//                 {
//                     voucherId: voucher._id,
//                     voucherCode: voucher.code,
//                     voucherDiscount: discount,
//                     totalAfterVoucher: finalTotal
//                 }
//             );
//         }
        
//         // Increment voucher usage (but don't mark as used until order is placed)
//         // We'll mark it as used when the order is completed
        
//         res.status(200).json({
//             success: true,
//             message: 'Voucher applied successfully',
//             data: {
//                 voucher: {
//                     id: voucher._id,
//                     code: voucher.code,
//                     name: voucher.name,
//                     description: voucher.description,
//                     discountType: voucher.discountType,
//                     discountValue: voucher.discountValue
//                 },
//                 originalTotal: orderTotal,
//                 discount: discount,
//                 finalTotal: finalTotal,
//                 savings: discount
//             }
//         });
        
//     } catch (error) {
//         console.error('Error applying voucher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to apply voucher',
//             error: error.message
//         });
//     }
// };



// // @desc    Validate voucher without applying
// // @route   POST /api/vouchers/validate
// // @access  Private
// const validateVoucher = async (req, res) => {
//     try {
//         const { code } = req.body;
//         const userId = req.user.userId;
        
//         if (!code) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher code is required'
//             });
//         }
        
//         // Get user's cart
//         const cart = await Cart.findOne({ userId }).populate('items.productId');
//         const orderTotal = cart?.items?.reduce((total, item) => {
//             return total + (item.productId.price * item.quantity);
//         }, 0) || 0;
        
//         // Validate voucher
//         const validation = await Voucher.validateVoucher(
//             code,
//             userId,
//             orderTotal,
//             cart?.items || []
//         );
        
//         if (!validation.valid) {
//             return res.status(400).json({
//                 success: false,
//                 message: validation.message
//             });
//         }
        
//         const voucher = validation.voucher;
//         const discount = voucher.calculateDiscount(orderTotal, cart?.items || []);
        
//         res.status(200).json({
//             success: true,
//             message: 'Voucher is valid',
//             data: {
//                 code: voucher.code,
//                 name: voucher.name,
//                 description: voucher.description,
//                 discountType: voucher.discountType,
//                 discountValue: voucher.discountValue,
//                 minimumOrderAmount: voucher.minimumOrderAmount,
//                 maxDiscountAmount: voucher.maxDiscountAmount,
//                 discount: discount,
//                 orderTotal: orderTotal,
//                 finalTotal: orderTotal - discount,
//                 savings: discount
//             }
//         });
        
//     } catch (error) {
//         console.error('Error validating voucher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to validate voucher',
//             error: error.message
//         });
//     }
// };

// // @desc    Mark voucher as used (called when order is completed)
// // @route   POST /api/vouchers/use
// // @access  Private
// const useVoucher = async (req, res) => {
//     try {
//         const { voucherCode, orderId } = req.body;
//         const userId = req.user.userId;
        
//         if (!voucherCode || !orderId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher code and order ID are required'
//             });
//         }
        
//         // Find voucher
//         const voucher = await Voucher.findOne({ 
//             code: voucherCode.toUpperCase(),
//             isActive: true,
//             isDeleted: false
//         });
        
//         if (!voucher) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Voucher not found'
//             });
//         }
        
//         // Get order
//         const order = await Order.findOne({ _id: orderId, userId });
//         if (!order) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Order not found'
//             });
//         }
        
//         // Check if voucher already used in this order
//         const alreadyUsed = voucher.usedBy.some(u => 
//             u.orderId.toString() === orderId
//         );
        
//         if (alreadyUsed) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher already used for this order'
//             });
//         }
        
//         // Increment usage
//         await voucher.incrementUsage(
//             userId,
//             orderId,
//             order.voucherDiscount || 0,
//             order.totalAmount
//         );
        
//         // Update order status
//         await Order.findByIdAndUpdate(orderId, {
//             voucherUsed: true,
//             voucherUsedAt: new Date()
//         });
        
//         res.status(200).json({
//             success: true,
//             message: 'Voucher marked as used successfully'
//         });
        
//     } catch (error) {
//         console.error('Error using voucher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to mark voucher as used',
//             error: error.message
//         });
//     }
// };

// // @desc    Get voucher statistics for admin
// // @route   GET /api/vouchers/stats
// // @access  Private/Admin
// const getVoucherStats = async (req, res) => {
//     try {
//         const stats = await Voucher.aggregate([
//             {
//                 $group: {
//                     _id: '$discountType',
//                     count: { $sum: 1 },
//                     totalUsed: { $sum: '$usedCount' },
//                     averageUsage: { $avg: '$usedCount' }
//                 }
//             }
//         ]);
        
//         const totalVouchers = await Voucher.countDocuments();
//         const activeVouchers = await Voucher.countDocuments({
//             isActive: true,
//             endDate: { $gte: new Date() }
//         });
//         const expiredVouchers = await Voucher.countDocuments({
//             endDate: { $lt: new Date() }
//         });
        
//         res.status(200).json({
//             success: true,
//             data: {
//                 totalVouchers,
//                 activeVouchers,
//                 expiredVouchers,
//                 usageStats: stats
//             }
//         });
        
//     } catch (error) {
//         console.error('Error getting voucher stats:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to get voucher stats',
//             error: error.message
//         });
//     }
// };

