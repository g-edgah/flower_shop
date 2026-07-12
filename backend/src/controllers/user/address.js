import mongoose from 'mongoose';

import User from '../../models/user.js';

import Country from '../../models/countrySchema.js';
import Region from '../../models/regionSchema.js';

export const getUserAddresses = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const user = await User.findById(id);


        
        const cards = user.paymentMethods?.card?.map((item) => ({
            _id: item._id,
            brand: item.brand,
            lastFour: item.lastFour
        })) || []


        const mobile =user.paymentMethods.mobile.map((item) => ({
            _id: item._id,
            brand: item.brand,
            lastFour: item.lastFour
        })) || []


        

        const defaultMethod = { 
            methodType: user.defaultPaymentMethod.methodType,
            methodId: user.defaultPaymentMethod.methodId
        }
        

        const paymentMethods ={
            cards: cards, 
            mobile: mobile,
            defaultMethod: defaultMethod
        }

        res.status(200).json({ 
            success: true,
            data: paymentMethods 
        })
    } catch (error) {
        res.status(404).json({ error: "error while fetching user payment methods" });
        console.error(`error while fetching user payment methods: ${error}`)
    }
}


export const addAddress = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { 
            firstName,
            lastName,
            country,
            region,
            city,
            address,
            info,
            mobile
        } = req.body;

        console.log("add payment method req: ",req.body)

        if (!type || !details) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields"
            });
        }

        const validTypes = ['mobile', 'card'] //, 'paypal'];
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


            if (number){
                // must contain only digits
                if (!/^\d+$/.test(number)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                } 

                // exactly 10 digits
                else if (!/^\d{10}$/.test(number)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                } 

                // starts with 07 or 01
                else if (!/^(07|01)/.test(number)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                }

            }
            

            // remove leadind 0
            const formattedPhone = number.replace(/^0/, '');
            const formattedNumber = `254${formattedPhone}`

            const providers = ['mpesa', 'airtel', 'tkash']
            if (!providers.includes(brand)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                });
            }

            

            if (firstName) {
                // only letters allowed
                if (!/^[A-Za-z]+$/.test(firstName)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                
                // only 2-50 characters
                } else if (firstName.length < 2 || firstName.length > 50) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                }
            }

            if (lastName) {
                // only letters allowed
                if (!/^[A-Za-z]+$/.test(lastName)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                
                // only 2-50 characters
                } else if (lastName.length < 2 || lastName.length > 50) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                }
            }
            
            

            if (!user.paymentMethods.mobile) {
                user.paymentMethods.mobile = [];
            }
            
            // Check for duplicate
            const existing = user.paymentMethods.mobile.find(
                m => m.number === formattedNumber
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
                                firstName: firstName,
                                lastName: lastName
                            },
                            lastFour: number.slice(-4)
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

            if (!cardNumber || !brand || !firstName || !lastName || !expiryDate?.month || !expiryDate?.year || !cvv) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required field(s)"
                })
            }

            if (cardNumber){
                // must contain only digits
                if (!/^\d+$/.test(cardNumber)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                } 

                // exactly 16 digits
                else if (!/^\d{16}$/.test(cardNumber)) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid data'
                    })
                } 

            }

            const years = ['2026', '2027', '2028', '2029', '2030']
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

            if (!years.includes(expiryDate.year)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid data",
                    year: expiryDate.year
                })
            }

            if (!months.includes(expiryDate.month)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid data"
                })
            }

            //cvv validation
            // must contain only digits
            if (!/^\d+$/.test(cvv)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid data"
                })
            } 
            // exactly 3 digits
            else if (!/^\d{3}$/.test(cvv)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid data"
                })
            } 

            //cardType validation
            const providers = ['visa', 'mastercard', 'mpesa']
            if (!providers.includes(brand)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                });
            }

            //validate names

            if (!firstName || !lastName) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                });
            }

            // contains only letters
            if (!/^[A-Za-z]+$/.test(lastName)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                });
            //between 2 and 50 characters long
            } else if (lastName.length < 2 || lastName.length > 50) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                });
            }

            // contains only letters
            if (!/^[A-Za-z]+$/.test(firstName)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                });
            //between 2 and 50 characters long
            } else if (firstName.length < 2 || firstName.length > 50) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                });
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

            const lastFour = cardNumber.slice(-4);
            const existing = user.paymentMethods.cards.find(
                c => c.cardNumber === cardNumber && c.brand === brand
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
                            cardNumber: cardNumber,
                            brand: brand,
                            holderName: {
                                firstName: firstName,
                                lastName: lastName
                            },
                            expiryDate: {
                                month: expiryDate.month.trim(),
                                year: expiryDate.year.trim()
                            },
                            cvv: cvv.trim(),
                            lastFour: lastFour
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





export const removeAddress = async (req, res) => {
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



export const editDefaultAddress = async (req, res) => {
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

export const getRegions = async(req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { countryName } = req.body

        if(!countryName) {
            return res.status(400).json({
                success: false,
                meessage: "Misssing required field(s)"
            })
        }

        const country = await Country.findOne({
            countryName: countryName
        })

        if (!country) {
            return res.status(400).json({
                success: false,
                meessage: "Non-existent country"
            })
        }

        if (country) {
            const data = {
                countryName: country.countryName,
                regions: country.regions
            }

            return res.status(200).json({
                success: true,
                data: data
            })
        }

    } catch(error){
        console.log("errror in getRegions: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server errror"
        })
    }
}


export const getCities = async(req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { countryName } = req.body

        if(!countryName) {
            return res.status(400).json({
                success: false,
                meessage: "Misssing required field(s)"
            })
        }

        const country = await Country.findOne({
            countryName: countryName
        })

        if (!country) {
            return res.status(400).json({
                success: false,
                meessage: "Non-existent country"
            })
        }

        if (country) {
            const data = {
                countryName: country.countryName,
                regions: country.regions
            }

            return res.status(200).json({
                success: true,
                data: data
            })
        }

    } catch(error){
        console.log("errror in getRegions: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server errror"
        })
    }
}