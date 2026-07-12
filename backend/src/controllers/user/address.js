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

        const addresses = user.addresses?.map((item) => ({
            _id: item._id,
            firstName: item.firstName,
            lastName: item.lastName,
            region: item.region,
            city: item.city,
            address: item.address,
            info: item.info,
            mobile: item.mobile
        })) || []
        
        const defaultAddress = { 
            addressId: user.defaultAddress.addressId
        }

        res.status(200).json({ 
            success: true,
            data: {
                addresses: addresses, 
                defaultAddress: defaultAddress
            }
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

        if (!firstName || !lastName, || !country || !region || !city || !address || !info || !mobile) {
            return res.status(400).json({
                success: false,
                error: "Missing required field(s)"
            });
        }


        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        const countryExists = await Country.findOne({
            countryName: country
        })
        if (!countryExists) {
            return res.status(404).json({
                success: false,
                error: "Country not found"
            });
        }

        const regionExists = await Region.findOne({
            regionName: region
        })
        if (!regionExists) {
            return res.status(404).json({
                success: false,
                error: "REgion not found"
            });
        }

        const regionInCountry = countryExists.regions.includes(region)
        if (!regionInCountry) {
            return res.status(404).json({
                success: false,
                error: "Region not for this country"
            });
        }

        const cityInRegion = regionExists.cities.includes(city)
        if (!cityInRegion) {
            return res.status(404).json({
                success: false,
                error: "Citynot for this region"
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

        if (mobile){
            // must contain only digits
            if (!/^\d+$/.test(mobile)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                })
            } 

            // exactly 10 digits
            else if (!/^\d{10}$/.test(mobile)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                })
            } 

            // starts with 07 or 01
            else if (!/^(07|01)/.test(mobile)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid data'
                })
            }

        }
        

        // remove leadind 0
        const formattedPhone = mobile.replace(/^0/, '');
        const formattedNumber = `254${formattedPhone}`

        await User.findByIdAndUpdate(
            id,
            { 
                $push: {
                    address: {
                        firstName: firstName,
                        lastName: lastName,
                        country: country,
                        region: region,
                        city: city,
                        address: address,
                        info: info,
                        mobile: formattedNumber
                    }
                }
            },
            {
                runValidators: true  // Validates against schema
            }
        );

        res.status(200).json({
            status: true,
            message: "Address added succsesfully"
        })

        

    } catch (error) {
        res.status(500).json({ error: "error while adding address" });
        console.error(`error inaddAddress: ${error}`)
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
            addressId
        } = req.body;

        //console.log("add payment method req: ",req.body)


        if (!addressId) {
            return res.status(400).json({
                success: false,
                error: "Missing required field(s)"
            });
        }


        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        

        if (!user.addresses) {
            return res.status(404).json({
                success: false,
                error: "No addresses found for this user"
            });
        }

        const index = user.addresses.findIndex(
            method => method._id.toString() === addressId
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                error: "Address not found"
            });
        }

        if (index !== -1) {
                    
            // remove item 
            await User.findByIdAndUpdate(
                id,
                { 
                    $pull: { 
                        addresses: { 
                            _id: addressId 
                        } 
                    } 
                }
            );

            if (user.defaultAddress.addressId === addressId) {
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
                message: "Address removed successfully"
            })
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

        const { countryName } = req.params

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

        const { regionName } = req.params

        if(!regionName) {
            return res.status(400).json({
                success: false,
                meessage: "Misssing required field(s)"
            })
        }

        const region = await Region.findOne({
            regionName: regionName
        })

        if (!region) {
            return res.status(400).json({
                success: false,
                meessage: "Non-existent region"
            })
        }

        if (region) {
            const data = {
                regionName: region.regionName,
                cities: region.cities
            }

            return res.status(200).json({
                success: true,
                data: data
            })
        }

    } catch(error){
        console.log("errror in getCities: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server errror"
        })
    }
}