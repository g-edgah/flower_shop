
import User from "../../models/user.js";
import Voucher from "../../models/voucher.js";
import Order from "../../models/order.js";
import Bouquet from "../../models/bouquet.js";
import Flower from "../../models/flower.js";



// // @desc    Create a new voucher (Admin)
// // @route   POST /api/vouchers
// // @access  Private/Admin
// const createVoucher = async (req, res) => {
//     try {
//         const userId = req.user.userId;
        
//         const voucherData = {
//             ...req.body,
//             createdBy: userId
//         };
        
//         const voucher = new Voucher(voucherData);
//         await voucher.save();
        
//         res.status(201).json({
//             success: true,
//             message: 'Voucher created successfully',
//             data: voucher
//         });
        
//     } catch (error) {
//         console.error('Error creating voucher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create voucher',
//             error: error.message
//         });
//     }
// };

// // Export all controllers
// module.exports = {
//     getUserVouchers,
//     getVoucherByCode,
//     applyVoucher,
//     removeVoucher,
//     validateVoucher,
//     useVoucher,
//     getVoucherStats,
//     createVoucher
// };


// // @desc    Remove voucher from cart/order
// // @route   DELETE /api/vouchers/remove
// // @access  Private
// const removeVoucher = async (req, res) => {
//     try {
//         const { orderId } = req.body;
//         const userId = req.user.userId;
        
//         if (orderId) {
//             // Remove from order
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
            
//             // Recalculate total without voucher
//             const originalTotal = order.items.reduce((total, item) => {
//                 return total + (item.price * item.quantity);
//             }, 0);
            
//             await Order.findByIdAndUpdate(orderId, {
//                 voucherId: null,
//                 voucherCode: null,
//                 voucherDiscount: 0,
//                 totalAmount: originalTotal,
//                 voucherApplied: null
//             });
            
//             return res.status(200).json({
//                 success: true,
//                 message: 'Voucher removed from order',
//                 data: {
//                     orderTotal: originalTotal
//                 }
//             });
//         } else {
//             // Remove from cart
//             await Cart.findOneAndUpdate(
//                 { userId },
//                 {
//                     voucherId: null,
//                     voucherCode: null,
//                     voucherDiscount: 0,
//                     totalAfterVoucher: null
//                 }
//             );
            
//             // Get updated cart total
//             const cart = await Cart.findOne({ userId }).populate('items.productId');
//             const total = cart?.items?.reduce((sum, item) => {
//                 return sum + (item.productId.price * item.quantity);
//             }, 0) || 0;
            
//             return res.status(200).json({
//                 success: true,
//                 message: 'Voucher removed from cart',
//                 data: {
//                     cartTotal: total
//                 }
//             });
//         }
        
//     } catch (error) {
//         console.error('Error removing voucher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to remove voucher',
//             error: error.message
//         });
//     }
// };

