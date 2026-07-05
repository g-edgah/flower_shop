import mongoose from 'mongoose';
import User from '../../models/User.js';

export const addPaymentMethod = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { 
            type,
            details 
        } = req.body;

        //console.log("add payment method req: ",req.body)

        if (!type || !details) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        const validTypes = ['mobile_money', 'card'] //, 'paypal'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                error: `Invalid methodType. Supported: ${validTypes.join(', ')}`
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        if (type === 'mobile_money') {
            const {
                number,
                brand,
                firstName,
                lastName
            } = details

            if (!number || !brand || !firstName || !lastName) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field(s)'
                });
            }

            let formattedPhone = number.replace(/\s/g, '');

            if (!/^\d{9}$/.test(formattedPhone)){
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                })
            }

            const formattedNumber = `254${formattedPhone}`

            const providers = ['mpesa', 'airtel_money', 'tkash']
            if (!providers.includes(brand)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid details'
                });
            }

            const formattedFirstName = firstName.replace(/\s/g, '');
            const formattedLastName = lastName.replace(/\s/g, '');

            if (!formattedFirstName || !formattedLastName) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required field'
                });
            }

            if (!/^.{2,}$/.test(formattedFirstName) || !/^.{2,}$/.test(formattedLastName)){
                return res.status(400).json({
                    success: false,
                    error: 'Invalid details'
                })
            }

            if (!user.paymentMethods.mobile) {
                user.paymentMethods.mobile = [];
            }

            // Check for duplicate
            const existing = user.paymentMethods.mobileMoney.find(
                m => m.number === formattedNumber && m.brand === brand.toLowerCase()
            );
            if (existing) {
                return res.status(409).json({
                    success: false,
                    error: 'This mobile money account is already added'
                });
            }

            await User.findByIdAndUpdate(
                id,
                {
                    $push: {
                        "paymentMethods.mobile": {
                            number: formattedNumber,
                            brand: brand,
                            name: {
                                firstName: formattedFirstName,
                                lastName: formattedLastName
                            }
                        }
                    }
                    
                },
                {
                    runValidators: true  // Validates against schema
                }
            );

            res.status(200).json({ 
                success: true,
                message: 'payment method added successfully'
            }) 





        } else if (type === 'card') {
            const {
                cardNumber,
                brand,
                firstName,
                lastName,
                expiryDate,
                cvv
            } = details

            if (!cardNumber || !brand || !firstName || !lastName || !expiryDate || !cvv) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required field(s)"
                })
            }

            const cleanCardNumber = cardNumber.replace(/\s/g, '');
            if (!/^\d{16}$/.test(cleanCardNumber)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid data)"
                })
            }

            if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid data)"
                })
            }

            if (!/^\d{3,4}$/.test(cvv)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid data)"
                })
            }

            const providers = ['visa', 'mastercard', 'mpesa_global']
            if (!providers.includes(brand)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid details'
                });
            }

            const formattedFirstName = firstName.replace(/\s/g, '');
            const formattedLastName = lastName.replace(/\s/g, '');

            if (!formattedFirstName || !formattedLastName) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid details'
                });
            }

            if (!/^.{2,}$/.test(formattedFirstName) || !/^.{2,}$/.test(formattedLastName)){
                return res.status(400).json({
                    success: false,
                    error: 'Invalid details'
                })
            }

            // // detect card brand
            // // commented out because mpesa global will have to be included
            // let cardBrand = 'unknown';
            // if (/^4/.test(cleanCardNumber)) brand = 'visa';
            // else if (/^5[1-5]/.test(cleanCardNumber) || /^222[1-9]/.test(cleanCardNumber) || /^2[3-6][0-9]{2}/.test(cleanCardNumber)) {
            //     cardBrand = 'mastercard';
            // } else if (/^3[47]/.test(cleanCardNumber)) {
            //     cardBrand = 'amex';
            // } else if (/^6011/.test(cleanCardNumber) || /^65/.test(cleanCardNumber) || /^64[4-9]/.test(cleanCardNumber)) {
            //     cardBrand = 'discover';
            // }

            // if (brand !== carrdBrand) {
            //     return res.status(400).json({
            //         success: false,
            //         message: "Invalid data"
            //     })
            // }

            // check for duplicates
            if (!user.paymentMethods.cards) {
                user.paymentMethods.cards = [];
            }

            const lastFour = cleanCardNumber.slice(-4);
            const existing = user.paymentMethods.cards.find(
                c => c.lastFour === lastFour && c.brand === brand
            );
            if (existing) {
                return res.status(409).json({
                    success: false,
                    error: 'This card has already been added'
                });
            }


            await User.findByIdAndUpdate(
                id,
                {
                    $push: {
                        "paymentMethods.card": {
                            cardNumber: cleanCardNumber,
                            brand: brand,
                            holderName: {
                                firstName: formattedFirstName,
                                lastName: formattedLastName
                            },
                            expiryDate: expiryDate.trim(),
                            cvv: cvv.trim()
                        }
                    }
                    
                },
                {
                    runValidators: true  // Validates against schema
                }
            );

            res.status(200).json({ 
                success: true,
                message: 'payment method added successfully'
            }) 

        } // else if (type === 'paypal') {
        //     const {
        //         paypalEmail,
        //         paypalAccountId = '',
        //         payerId = '',
        //         displayName = '',
        //         accountType = 'personal'
        //     } = details;

        //     // Validate required fields
        //     if (!paypalEmail) {
        //         return res.status(400).json({
        //             success: false,
        //             error: 'PayPal email is required'
        //         });
        //     }

        //     // Validate email format
        //     const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        //     if (!emailRegex.test(paypalEmail)) {
        //         return res.status(400).json({
        //             success: false,
        //             error: 'Invalid PayPal email address'
        //         });
        //     }

        //     // Initialize paypal array if it doesn't exist
        //     if (!user.paymentMethods.paypal) {
        //         user.paymentMethods.paypal = [];
        //     }

        //     // Check for duplicate (same email)
        //     const existing = user.paymentMethods.paypal.find(
        //         p => p.paypalEmail.toLowerCase() === paypalEmail.toLowerCase()
        //     );
        //     if (existing) {
        //         return res.status(409).json({
        //             success: false,
        //             error: 'This PayPal account is already added'
        //         });
        //     }

        //     // Create PayPal data
        //     const paypalData = {
        //         paypalEmail: paypalEmail.toLowerCase().trim(),
        //         paypalAccountId: paypalAccountId,
        //         payerId: payerId,
        //         displayName: displayName || paypalEmail.split('@')[0],
        //         accountType: accountType,
        //         isDefault: isDefault && user.paymentMethods.paypal.length === 0,
        //         status: 'unverified',
        //         isVerified: false,
        //         createdAt: new Date(),
        //         lastUsedAt: new Date(),
        //     };

        //     user.paymentMethods.paypal.push(paypalData);
        // }
        

        

    } catch (error) {
        res.status(500).json({ error: "error while adding payment account" });
        console.error(`error while adding payment account: ${error}`)
    }
}





export const removePaymentMethod = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { 
            type,
            methodId
        } = req.body;

        //console.log("add payment method req: ",req.body)


        if (!type || !details) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        const validTypes = ['mobile_money', 'card'] //, 'paypal'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                error: `Invalid methodType. Supported: ${validTypes.join(', ')}`
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        if (type === 'mobile') {

            if (!user.paymentMethods.mobile || user.paymentMethods.mobile.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "No mobile money accounts found for this user"
                });
            }

            const index = user.paymentMethods.mobile.findIndex(
                method => method._id.toString() === methodId
            );

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: "Mobile money account not found"
                });
            }

            if (index !== -1) {
                        
                // remove item 
                await User.findByIdAndUpdate(
                    id,
                    { 
                        $pull: { 
                            "paymentMethods.mobile": { 
                                _id: methodId 
                            } 
                        } 
                    }
                );

                if (user.defaultPaymentMethod.methodId === methodId) {
                    await User.findByIdAndUpdate(
                    id,
                    { 
                        $set: { 
                            defaultPaymentMethod: { 
                                methodType: null,
                                methodId: null
                            } 
                        } 
                    });
                }

                return res,status(200).json({
                    success: true,
                    message: "Payment account removed successfully"
                })
            }



        } else if(type === 'card') {

            if (!user.paymentMethods.card || user.paymentMethods.card.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "No cards found for this user"
                });
            }

            const index = user.paymentMethods.card.findIndex(
                method => method._id.toString() === methodId
            );

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: "Card not found"
                });
            }

            if (index !== -1) {
                        
                // remove item 
                await User.findByIdAndUpdate(
                    id,
                    { 
                        $pull: { 
                            "paymentMethods.card": { 
                                _id: methodId 
                            } 
                        } 
                    }
                );

                if (user.defaultPaymentMethod.methodId === methodId) {
                    await User.findByIdAndUpdate(
                    id,
                    { 
                        $set: { 
                            defaultPaymentMethod: { 
                                methodType: null,
                                methodId: null
                            } 
                        } 
                    });
                }

                return res,status(200).json({
                    success: true,
                    message: "Payment account removed successfully"
                })
            }
        }


    } catch (error) {
        res.status(500).json({ error: "error while reemoving payment account" });
        console.error(`error while while reemoving payment account: ${error}`)
    }
}



export const editDefaultMethod = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { 
            type,
            methodId
        } = req.body;

        //console.log("add payment method req: ",req.body)


        if (!type || !details) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        const validTypes = ['mobile_money', 'card'] //, 'paypal'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                error: `Invalid methodType. Supported: ${validTypes.join(', ')}`
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        if (type === 'mobile') {

            if (!user.paymentMethods.mobile || user.paymentMethods.mobile.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "No mobile money accounts found for this user"
                });
            }

            const index = user.paymentMethods.mobile.findIndex(
                method => method._id.toString() === methodId
            );

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: "Mobile money account not found"
                });
            }

            if (index !== -1) {
                        
               if (user.defaultPaymentMethod.methodId === methodId) {
                    return res,status(400).json({
                        success: true,
                        message: "Payment account is already the default"
                    })

                } else if (user.defaultPaymentMethod.methodId !== methodId) {
                    await User.findByIdAndUpdate(
                    id,
                    { 
                        $set: { 
                            defaultPaymentMethod: { 
                                methodType: type,
                                methodId: methodId
                            } 
                        } 
                    });

                    return res,status(200).json({
                        success: true,
                        message: "Payment account successfully set as default"
                    })
                }

                
            }



        } else if(type === 'card') {

            if (!user.paymentMethods.card || user.paymentMethods.card.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "No cards found for this user"
                });
            }

            const index = user.paymentMethods.card.findIndex(
                method => method._id.toString() === methodId
            );

            if (index === -1) {
                return res.status(404).json({
                    success: false,
                    error: "Card not found"
                });
            }

            if (index !== -1) {
                        

                if (user.defaultPaymentMethod.methodId === methodId) {
                    return res,status(400).json({
                        success: true,
                        message: "Payment account is already the default"
                    })

                } else if (user.defaultPaymentMethod.methodId !== methodId) {
                    await User.findByIdAndUpdate(
                    id,
                    { 
                        $set: { 
                            defaultPaymentMethod: { 
                                methodType: type,
                                methodId: methodId
                            } 
                        } 
                    });

                    return res,status(200).json({
                        success: true,
                        message: "Payment account successfully set as default"
                    })
                }
            }
        }

    } catch (error) {
        res.status(500).json({ error: "error while updating default payment account" });
        console.error(`error while while updating default payment account: ${error}`)
    }
}