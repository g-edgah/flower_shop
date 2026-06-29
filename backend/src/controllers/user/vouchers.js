import User from "../../models/user.js";
import Voucher from "../../models/voucher.js";
import Order from "../../models/order.js";
import Bouquet from "../../models/bouquet.js";
import Flower from "../../models/flower.js";

import mongoose from 'mongoose';

// @desc    Get all valid vouchers for a user (OPTIMIZED)
// @route   GET /api/vouchers
// @access  Private
export const getUserVouchers = async (req, res) => {
    try {
        const id = req.user.id;
        const { orderTotal = 0 } = req.query;
        const now = new Date();

        // using aggregation pipeline for efficient filtering
        const vouchers = await Voucher.aggregate([
            // stage 1: match basic criteria (uses indexes)
            {
                $match: {
                    isActive: true,
                    isDeleted: { $ne: true },
                    startDate: { $lte: now },
                    endDate: { $gte: now },
                    $or: [
                        { usageLimit: null },
                        { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
                    ]
                }
            },
            // stage 2: filter by user eligibility
            {
                $match: {
                    $or: [
                        { applicableTo: { $ne: 'specific_users' } },
                        { 
                            $and: [
                                { applicableTo: 'specific_users' },
                                { applicableUsers: { $in: [new mongoose.Types.ObjectId(id)] } }
                            ]
                        }
                    ]
                }
            },
            // stage 3: calculate user usage count
            {
                $addFields: {
                    userUsageCount: {
                        $size: {
                            $filter: {
                                input: '$usedBy',
                                as: 'usage',
                                cond: { 
                                    $eq: ['$$usage.id', new mongoose.Types.ObjectId(id)] 
                                }
                            }
                        }
                    }
                }
            },
            // stage 4: filter by per-user limit
            {
                $match: {
                    $expr: { 
                        $lt: ['$userUsageCount', '$perUserLimit'] 
                    }
                }
            },
            // Stage 5: Filter by minimum order amount
            {
                $match: {
                    minimumOrderAmount: { $lte: Number(orderTotal) || 0 }
                }
            },
            // stage 6: calculate potential savings
            {
                $addFields: {
                    potentialSavings: {
                        $cond: [
                            { $eq: ['$discountType', 'percentage'] },
                            { 
                                $multiply: [
                                    Number(orderTotal) || 0,
                                    { $divide: ['$discountValue', 100] }
                                ]
                            },
                            '$discountValue'
                        ]
                    },
                    isExpiringSoon: {
                        $lte: [
                            '$endDate',
                            new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                        ]
                    }
                }
            },
            // stage 7: limit potential savings by max discount
            {
                $addFields: {
                    potentialSavings: {
                        $cond: [
                            { 
                                $and: [
                                    { $ne: ['$maxDiscountAmount', null] },
                                    { $gt: ['$potentialSavings', '$maxDiscountAmount'] }
                                ]
                            },
                            '$maxDiscountAmount',
                            '$potentialSavings'
                        ]
                    }
                }
            },
            // stage 8: project only needed fields
            {
                $project: {
                    _id: 1,
                    code: 1,
                    name: 1,
                    description: 1,
                    discountType: 1,
                    discountValue: 1,
                    minimumOrderAmount: 1,
                    maxDiscountAmount: 1,
                    startDate: 1,
                    endDate: 1,
                    usedCount: 1,
                    perUserLimit: 1,
                    userUsageCount: 1,
                    potentialSavings: 1,
                    isExpiringSoon: 1,
                    remainingUses: {
                        $cond: [
                            { $eq: ['$usageLimit', null] },
                            null,
                            { $subtract: ['$usageLimit', '$usedCount'] }
                        ]
                    },
                    remainingUserUses: {
                        $subtract: ['$perUserLimit', '$userUsageCount']
                    }
                }
            },
            // stage 9: sort by potential savings (highest first)
            {
                $sort: { 
                    potentialSavings: -1,
                    endDate: 1 // Expiring soon first
                }
            }
        ]);

        console.log(`vouchers for user ${id} : ${vouchers}`)

        res.status(200).json({
            success: true,
            count: vouchers.length,
            vouchers,
            summary: {
                totalAvailable: vouchers.length,
                bestDiscount: vouchers.length > 0 ? vouchers[0].potentialSavings : 0
            }
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

// // @desc    Get voucher by code (OPTIMIZED with single query)
// // @route   GET /api/vouchers/:code
// // @access  Private
// export const getVoucherByCode = async (req, res) => {
//     try {
//         const { code } = req.params;
//         const id = req.user.id;
//         const { orderTotal = 0 } = req.query;

//         // Single efficient query with user validation
//         const voucher = await Voucher.aggregate([
//             // Stage 1: Find by code
//             {
//                 $match: {
//                     code: code.toUpperCase(),
//                     isActive: true,
//                     isDeleted: { $ne: true }
//                 }
//             },
//             // Stage 2: Check dates
//             {
//                 $match: {
//                     startDate: { $lte: new Date() },
//                     endDate: { $gte: new Date() }
//                 }
//             },
//             // Stage 3: Check usage limits
//             {
//                 $match: {
//                     $or: [
//                         { usageLimit: null },
//                         { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
//                     ]
//                 }
//             },
//             // Stage 4: Check user eligibility
//             {
//                 $match: {
//                     $or: [
//                         { applicableTo: { $ne: 'specific_users' } },
//                         { 
//                             $and: [
//                                 { applicableTo: 'specific_users' },
//                                 { applicableUsers: { $in: [new mongoose.Types.ObjectId(id)] } }
//                             ]
//                         }
//                     ]
//                 }
//             },
//             // Stage 5: Calculate user usage
//             {
//                 $addFields: {
//                     userUsageCount: {
//                         $size: {
//                             $filter: {
//                                 input: '$usedBy',
//                                 as: 'usage',
//                                 cond: { 
//                                     $eq: ['$$usage.id', new mongoose.Types.ObjectId(id)] 
//                                 }
//                             }
//                         }
//                     }
//                 }
//             },
//             // Stage 6: Check per-user limit
//             {
//                 $match: {
//                     $expr: { 
//                         $lt: ['$userUsageCount', '$perUserLimit'] 
//                     }
//                 }
//             },
//             // Stage 7: Check minimum order
//             {
//                 $match: {
//                     minimumOrderAmount: { $lte: Number(orderTotal) || 0 }
//                 }
//             },
//             // Stage 8: Calculate discount
//             {
//                 $addFields: {
//                     calculatedDiscount: {
//                         $cond: [
//                             { $eq: ['$discountType', 'percentage'] },
//                             { 
//                                 $multiply: [
//                                     Number(orderTotal) || 0,
//                                     { $divide: ['$discountValue', 100] }
//                                 ]
//                             },
//                             '$discountValue'
//                         ]
//                     }
//                 }
//             },
//             // Stage 9: Apply max discount cap
//             {
//                 $addFields: {
//                     calculatedDiscount: {
//                         $cond: [
//                             { 
//                                 $and: [
//                                     { $ne: ['$maxDiscountAmount', null] },
//                                     { $gt: ['$calculatedDiscount', '$maxDiscountAmount'] }
//                                 ]
//                             },
//                             '$maxDiscountAmount',
//                             '$calculatedDiscount'
//                         ]
//                     }
//                 }
//             },
//             // Stage 10: Project final fields
//             {
//                 $project: {
//                     _id: 1,
//                     code: 1,
//                     name: 1,
//                     description: 1,
//                     discountType: 1,
//                     discountValue: 1,
//                     minimumOrderAmount: 1,
//                     maxDiscountAmount: 1,
//                     startDate: 1,
//                     endDate: 1,
//                     calculatedDiscount: 1,
//                     userUsageCount: 1,
//                     perUserLimit: 1,
//                     remainingUses: {
//                         $cond: [
//                             { $eq: ['$usageLimit', null] },
//                             null,
//                             { $subtract: ['$usageLimit', '$usedCount'] }
//                         ]
//                     },
//                     remainingUserUses: {
//                         $subtract: ['$perUserLimit', '$userUsageCount']
//                     }
//                 }
//             }
//         ]);

//         if (!voucher || voucher.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Voucher not found or not applicable'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             voucher: voucher[0]
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

// // @desc    Get available vouchers for user with caching
// // @route   GET /api/vouchers/available
// // @access  Private
// export const getAvailableVouchers = async (req, res) => {
//     try {
//         const id = req.user.id;
//         const { orderTotal = 0 } = req.query;
//         const now = new Date();

//         // Use MongoDB's aggregation with pipeline optimization
//         const vouchers = await Voucher.aggregate([
//             // Stage 1: Index-optimized match
//             {
//                 $match: {
//                     isActive: true,
//                     isDeleted: { $ne: true },
//                     startDate: { $lte: now },
//                     endDate: { $gte: now }
//                 }
//             },
//             // Stage 2: Join with user eligibility (more efficient than $in)
//             {
//                 $match: {
//                     $expr: {
//                         $or: [
//                             { $ne: ['$applicableTo', 'specific_users'] },
//                             {
//                                 $and: [
//                                     { $eq: ['$applicableTo', 'specific_users'] },
//                                     { $in: [new mongoose.Types.ObjectId(id), '$applicableUsers'] }
//                                 ]
//                             }
//                         ]
//                     }
//                 }
//             },
//             // Stage 3: Usage limit check (using expression)
//             {
//                 $match: {
//                     $expr: {
//                         $or: [
//                             { $eq: ['$usageLimit', null] },
//                             { $lt: ['$usedCount', '$usageLimit'] }
//                         ]
//                     }
//                 }
//             },
//             // Stage 4: Calculate user usage efficiently
//             {
//                 $addFields: {
//                     userUsageCount: {
//                         $size: {
//                             $filter: {
//                                 input: '$usedBy',
//                                 as: 'usage',
//                                 cond: { 
//                                     $eq: ['$$usage.id', new mongoose.Types.ObjectId(id)] 
//                                 }
//                             }
//                         }
//                     }
//                 }
//             },
//             // Stage 5: Filter by per-user limit
//             {
//                 $match: {
//                     $expr: { $lt: ['$userUsageCount', '$perUserLimit'] }
//                 }
//             },
//             // Stage 6: Filter by order amount
//             {
//                 $match: {
//                     $expr: {
//                         $lte: ['$minimumOrderAmount', Number(orderTotal) || 0]
//                     }
//                 }
//             },
//             // Stage 7: Add computed fields
//             {
//                 $addFields: {
//                     discountAmount: {
//                         $cond: [
//                             { $eq: ['$discountType', 'percentage'] },
//                             { 
//                                 $min: [
//                                     { 
//                                         $multiply: [
//                                             Number(orderTotal) || 0,
//                                             { $divide: ['$discountValue', 100] }
//                                         ]
//                                     },
//                                     { $ifNull: ['$maxDiscountAmount', Infinity] }
//                                 ]
//                             },
//                             { $min: ['$discountValue', Number(orderTotal) || 0] }
//                         ]
//                     },
//                     isExpiringSoon: {
//                         $lte: [
//                             '$endDate',
//                             new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
//                         ]
//                     }
//                 }
//             },
//             // Stage 8: Sort for best user experience
//             {
//                 $sort: {
//                     discountAmount: -1,
//                     isExpiringSoon: -1,
//                     endDate: 1
//                 }
//             },
//             // Stage 9: Limit results for performance
//             {
//                 $limit: 50
//             },
//             // Stage 10: Final projection
//             {
//                 $project: {
//                     _id: 1,
//                     code: 1,
//                     name: 1,
//                     description: 1,
//                     discountType: 1,
//                     discountValue: 1,
//                     minimumOrderAmount: 1,
//                     maxDiscountAmount: 1,
//                     endDate: 1,
//                     discountAmount: 1,
//                     isExpiringSoon: 1,
//                     usageLeft: {
//                         $cond: [
//                             { $eq: ['$usageLimit', null] },
//                             null,
//                             { $subtract: ['$usageLimit', '$usedCount'] }
//                         ]
//                     },
//                     userUsesLeft: {
//                         $subtract: ['$perUserLimit', '$userUsageCount']
//                     }
//                 }
//             }
//         ]);

//         res.status(200).json({
//             success: true,
//             count: vouchers.length,
//             vouchers,
//             stats: {
//                 totalAvailable: vouchers.length,
//                 bestDiscount: vouchers.length > 0 ? vouchers[0].discountAmount : 0,
//                 expiringSoon: vouchers.filter(v => v.isExpiringSoon).length
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching available vouchers:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch available vouchers',
//             error: error.message
//         });
//     }
// };

// // @desc    Get vouchers with pagination for admin
// // @route   GET /api/vouchers/admin
// // @access  Private/Admin
// export const getVouchersAdmin = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 20;
//         const skip = (page - 1) * limit;
//         const { search, status, discountType } = req.query;

//         // Build filter
//         const filter = {};
//         if (search) {
//             filter.$or = [
//                 { code: { $regex: search, $options: 'i' } },
//                 { name: { $regex: search, $options: 'i' } }
//             ];
//         }
//         if (status === 'active') filter.isActive = true;
//         if (status === 'inactive') filter.isActive = false;
//         if (discountType) filter.discountType = discountType;

//         const [vouchers, total] = await Promise.all([
//             Voucher.find(filter)
//                 .sort({ createdAt: -1 })
//                 .skip(skip)
//                 .limit(limit)
//                 .populate('createdBy', 'name email'),
//             Voucher.countDocuments(filter)
//         ]);

//         res.status(200).json({
//             success: true,
//             vouchers,
//             pagination: {
//                 page,
//                 limit,
//                 total,
//                 pages: Math.ceil(total / limit)
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching admin vouchers:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch vouchers',
//             error: error.message
//         });
//     }
// };

// // Helper function to get user eligible vouchers count (for caching)
// export const getUserVoucherCount = async (req, res) => {
//     try {
//         const id = req.user.id;
        
//         const count = await Voucher.countDocuments({
//             isActive: true,
//             startDate: { $lte: new Date() },
//             endDate: { $gte: new Date() },
//             $or: [
//                 { usageLimit: null },
//                 { $expr: { $lt: ['$usedCount', '$usageLimit'] } }
//             ],
//             $or: [
//                 { applicableTo: { $ne: 'specific_users' } },
//                 { 
//                     $and: [
//                         { applicableTo: 'specific_users' },
//                         { applicableUsers: id }
//                     ]
//                 }
//             ]
//         });

//         res.status(200).json({
//             success: true,
//             count
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to get voucher count',
//             error: error.message
//         });
//     }
// };