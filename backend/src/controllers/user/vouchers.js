import User from "../../models/user.js";
import Voucher from "../../models/voucher.js";
import Order from "../../models/order.js";
import Bouquet from "../../models/bouquet.js";
import Flower from "../../models/flower.js";


// @desc    Get all valid vouchers for a user
// @route   GET /api/vouchers
// @access  Private
export const getUserVouchers = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderTotal = 0 } = req.query;

        const now = new Date();

        // Find all valid vouchers
        const vouchers = await Voucher.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
            $or: [
                { usageLimit: null },
                { usedCount: { $lt: '$usageLimit' } }
            ]
        });

        // Filter vouchers based on user eligibility
        const eligibleVouchers = vouchers.filter(voucher => {
            // Check if user is eligible
            if (voucher.applicableTo === 'specific_users') {
                if (!voucher.applicableUsers.includes(userId)) {
                    return false;
                }
            }

            // Check if user has reached per-user limit
            const userUsage = voucher.usedBy.filter(
                entry => entry.userId.toString() === userId.toString()
            );
            if (userUsage.length >= voucher.perUserLimit) {
                return false;
            }

            // Check minimum order amount
            if (orderTotal < voucher.minimumOrderAmount) {
                return false;
            }

            return true;
        });

        // Format vouchers for response
        const formattedVouchers = eligibleVouchers.map(voucher => ({
            id: voucher._id,
            code: voucher.code,
            name: voucher.name,
            description: voucher.description,
            discountType: voucher.discountType,
            discountValue: voucher.discountValue,
            minimumOrderAmount: voucher.minimumOrderAmount,
            maxDiscountAmount: voucher.maxDiscountAmount,
            validUntil: voucher.endDate,
            isExpiringSoon: isExpiringSoon(voucher.endDate),
            savings: voucher.calculateDiscount(Number(orderTotal))
        }));

        res.status(200).json({
            success: true,
            count: formattedVouchers.length,
            vouchers: formattedVouchers
        });

    } catch (error) {
        console.error('Error fetching vouchers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vouchers',
            error: error.message
        });
    }
};

// // @desc    Get voucher by code
// // @route   GET /api/vouchers/:code
// // @access  Private
// export const getVoucherByCode = async (req, res) => {
//     try {
//         const { code } = req.params;
//         const userId = req.user.id;

//         const voucher = await Voucher.findOne({ 
//             code: code.toUpperCase(),
//             isActive: true
//         });

//         if (!voucher) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Voucher not found or inactive'
//             });
//         }

//         // Check if voucher is valid
//         const now = new Date();
//         if (voucher.startDate > now) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher is not yet active'
//             });
//         }

//         if (voucher.endDate < now) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher has expired'
//             });
//         }

//         // Check user eligibility
//         if (voucher.applicableTo === 'specific_users') {
//             if (!voucher.applicableUsers.includes(userId)) {
//                 return res.status(403).json({
//                     success: false,
//                     message: 'Voucher is not applicable to this user'
//                 });
//             }
//         }

//         // Check per-user limit
//         const userUsage = voucher.usedBy.filter(
//             entry => entry.userId.toString() === userId.toString()
//         );
//         if (userUsage.length >= voucher.perUserLimit) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'You have already used this voucher the maximum number of times'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             voucher: {
//                 id: voucher._id,
//                 code: voucher.code,
//                 name: voucher.name,
//                 description: voucher.description,
//                 discountType: voucher.discountType,
//                 discountValue: voucher.discountValue,
//                 minimumOrderAmount: voucher.minimumOrderAmount,
//                 maxDiscountAmount: voucher.maxDiscountAmount,
//                 validUntil: voucher.endDate
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
// export const applyVoucher = async (req, res) => {
//     try {
//         const { code, orderTotal, cartItems, shippingCost = 0 } = req.body;
//         const userId = req.user.id;

//         if (!code) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher code is required'
//             });
//         }

//         // Find the voucher
//         const voucher = await Voucher.findOne({ 
//             code: code.toUpperCase(),
//             isActive: true
//         });

//         if (!voucher) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Invalid voucher code'
//             });
//         }

//         // Validate voucher
//         const validationResult = await validateVoucher(voucher, userId, orderTotal, cartItems);
//         if (!validationResult.valid) {
//             return res.status(400).json({
//                 success: false,
//                 message: validationResult.message
//             });
//         }

//         // Calculate discount
//         let discount = 0;
//         if (voucher.discountType === 'free_shipping') {
//             discount = shippingCost;
//         } else {
//             discount = voucher.calculateDiscount(orderTotal);
//         }

//         // Calculate final total
//         const finalTotal = orderTotal + shippingCost - discount;

//         res.status(200).json({
//             success: true,
//             data: {
//                 voucher: {
//                     id: voucher._id,
//                     code: voucher.code,
//                     name: voucher.name,
//                     discountType: voucher.discountType,
//                     discountValue: voucher.discountValue
//                 },
//                 discount: {
//                     amount: discount,
//                     type: voucher.discountType,
//                     details: voucher.discountType === 'free_shipping' 
//                         ? 'Free shipping applied' 
//                         : `${voucher.discountValue}${voucher.discountType === 'percentage' ? '%' : ' fixed'} discount`
//                 },
//                 breakdown: {
//                     subtotal: orderTotal,
//                     shipping: shippingCost,
//                     discount: discount,
//                     total: finalTotal
//                 }
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

// // @desc    Remove applied voucher
// // @route   DELETE /api/vouchers/apply
// // @access  Private
// export const removeVoucher = async (req, res) => {
//     try {
//         // In a stateless API, you'd typically store the applied voucher in session or cart
//         // For now, we'll just return success
//         res.status(200).json({
//             success: true,
//             message: 'Voucher removed successfully'
//         });
//     } catch (error) {
//         console.error('Error removing voucher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to remove voucher'
//         });
//     }
// };

// // @desc    Use voucher (called during checkout)
// // @route   POST /api/vouchers/use
// // @access  Private
// export const useVoucher = async (req, res) => {
//     try {
//         const { code, orderId, orderTotal } = req.body;
//         const userId = req.user.id;

//         if (!code || !orderId) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher code and order ID are required'
//             });
//         }

//         const voucher = await Voucher.findOne({ 
//             code: code.toUpperCase(),
//             isActive: true
//         });

//         if (!voucher) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Voucher not found'
//             });
//         }

//         // Re-validate before using
//         const validationResult = await validateVoucher(voucher, userId, orderTotal);
//         if (!validationResult.valid) {
//             return res.status(400).json({
//                 success: false,
//                 message: validationResult.message
//             });
//         }

//         // Calculate discount
//         let discount = 0;
//         if (voucher.discountType === 'free_shipping') {
//             // Get shipping cost from order
//             const order = await Order.findById(orderId);
//             if (!order) {
//                 return res.status(404).json({
//                     success: false,
//                     message: 'Order not found'
//                 });
//             }
//             discount = order.shippingCost || 0;
//         } else {
//             discount = voucher.calculateDiscount(orderTotal);
//         }

//         // Record usage
//         await voucher.incrementUsage(userId, orderId, discount, orderTotal);

//         // Update the order with voucher information
//         await Order.findByIdAndUpdate(orderId, {
//             voucherApplied: {
//                 code: voucher.code,
//                 discount: discount,
//                 voucherId: voucher._id
//             }
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Voucher applied successfully',
//             data: {
//                 voucher: {
//                     code: voucher.code,
//                     name: voucher.name
//                 },
//                 discount: discount,
//                 remainingUses: voucher.usageLimit ? voucher.usageLimit - voucher.usedCount : null
//             }
//         });

//     } catch (error) {
//         console.error('Error using voucher:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to use voucher',
//             error: error.message
//         });
//     }
// };

// // @desc    Check voucher validity
// // @route   POST /api/vouchers/validate
// // @access  Private
// export const validateVoucherCode = async (req, res) => {
//     try {
//         const { code, orderTotal = 0, cartItems = [] } = req.body;
//         const userId = req.user.id;

//         if (!code) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Voucher code is required'
//             });
//         }

//         const voucher = await Voucher.findOne({ 
//             code: code.toUpperCase(),
//             isActive: true
//         });

//         if (!voucher) {
//             return res.status(404).json({
//                 success: false,
//                 valid: false,
//                 message: 'Invalid voucher code'
//             });
//         }

//         const validationResult = await validateVoucher(voucher, userId, orderTotal, cartItems);
        
//         if (!validationResult.valid) {
//             return res.status(400).json({
//                 success: false,
//                 valid: false,
//                 message: validationResult.message
//             });
//         }

//         const potentialDiscount = voucher.discountType === 'free_shipping' 
//             ? 0 
//             : voucher.calculateDiscount(orderTotal);

//         res.status(200).json({
//             success: true,
//             valid: true,
//             data: {
//                 code: voucher.code,
//                 name: voucher.name,
//                 description: voucher.description,
//                 discountType: voucher.discountType,
//                 discountValue: voucher.discountValue,
//                 potentialDiscount: potentialDiscount,
//                 minimumOrderAmount: voucher.minimumOrderAmount,
//                 maxDiscountAmount: voucher.maxDiscountAmount
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

// // Helper Functions

// // Validate voucher
// async function validateVoucher(voucher, userId, orderTotal, cartItems = []) {
//     const now = new Date();

//     // Check if voucher is active
//     if (!voucher.isActive) {
//         return { valid: false, message: 'Voucher is not active' };
//     }

//     // Check date range
//     if (voucher.startDate > now) {
//         return { valid: false, message: 'Voucher is not yet active' };
//     }

//     if (voucher.endDate < now) {
//         return { valid: false, message: 'Voucher has expired' };
//     }

//     // Check usage limit
//     if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
//         return { valid: false, message: 'Voucher usage limit has been reached' };
//     }

//     // Check user eligibility
//     if (voucher.applicableTo === 'specific_users') {
//         if (!voucher.applicableUsers.includes(userId)) {
//             return { valid: false, message: 'Voucher is not applicable to this user' };
//         }
//     }

//     // Check per-user limit
//     const userUsage = voucher.usedBy.filter(
//         entry => entry.userId.toString() === userId.toString()
//     );
//     if (userUsage.length >= voucher.perUserLimit) {
//         return { valid: false, message: 'You have already used this voucher the maximum number of times' };
//     }

//     // Check minimum order amount
//     if (orderTotal < voucher.minimumOrderAmount) {
//         return { 
//             valid: false, 
//             message: `Minimum order amount of ${voucher.minimumOrderAmount} required` 
//         };
//     }

//     // If free shipping, no further validation needed
//     if (voucher.discountType === 'free_shipping') {
//         return { valid: true };
//     }

//     return { valid: true };
// }

// // Helper: Check if voucher is expiring soon (within 3 days)
// function isExpiringSoon(endDate) {
//     const now = new Date();
//     const threeDaysFromNow = new Date();
//     threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
//     return endDate <= threeDaysFromNow && endDate >= now;
// }