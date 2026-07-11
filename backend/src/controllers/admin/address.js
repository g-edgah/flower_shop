import Country from '../../models/countrySchema.js';
import Region from '../../models/regionSchema.js';


export const addCountryRegions = async(req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }
 
        const { countryName, regions } = req.body;
        console.log("add country req body: ", req.body)


        // validate data
        if (!regions || !countryName) {
            console.log("invalid country data", req.body)
            return res.status(400).json({
                success: false,
                message: 'weird data dude'
            });
        } 


        // find country
        const country = await Country.findOne({
            countryName: countryName
        });

        if (!country) {
            const newCountry = new Country({
                countryName: countryName,
                regions: regions,
            });

            const savedCountry = await newCountry.save()

        } else if (country) {
                
            // check if region already in country
            const existingRegions = country.regions.map(item => item.toString());
            const newRegions = regions.filter(
                region => !existingRegions.includes(region.toString())
            )

            if (newRegions.length > 0) {
                await Country.findOneAndUpdate({
                    countryName: country
                    },
                    {
                        $addToSet: { // prevents duplicates
                            regions: { 
                                $each: newRegions
                            }
                        }
                    },
                    {
                        // runValidators: true  // Validates against schema
                    }
                );
            }
        }
                    
            

        res.status(200).json({
            success: true,
            message: country ? 'Country updated successfully' : 'Country added successfully',
        });

    } catch (error) {
        res.status(500).json({            
            success: false,
            message: 'Internal server error', 
        });
        console.error(`error while adding country: ${error}`)
    }
}




export const removeCountryRegions = async(req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }
 
        const { countryName, regions } = req.body;
        console.log("add country req body: ", req.body)


        // validate data
        if (!regions || !countryName) {
            console.log("invalid country data", req.body)
            return res.status(400).json({
                success: false,
                message: 'weird data dude'
            });
        } 


        // find country
        const country = await Country.findOne({
            countryName: countryName
        });

        if (!country) {
            return res.status(400).json({
                success: false,
                message: "non existent country"
            })

        } else if (country) {

            // clear all regions
            if (regions === "all") {
                await Country.findOneAndUpdate({
                    countryName: countryName
                    },
                    {
                        $set: { 
                            regions: []
                        }
                    },
                    {
                        // runValidators: true  // Validates against schema
                    }
                );
            
            // remove specific regions
            } else {
                    
                // check if region is in country
                const existingRegions = country.regions.map(item => item.toString());

                //only remove regions that actually exists
                const regionsToRemove = regions.filter(
                    r => existingRegions.includes(r.toString())
                )

                if (regionsToRemove.length > 0) {
                    await Country.findOneAndUpdate({
                        countryName: countryName
                        },
                        {
                            $pull: { 
                                regions: { 
                                    $in: regionsToRemove
                                }
                            }
                        },
                        {
                            // runValidators: true  // Validates against schema
                        }
                    );
                }
            }
        }
                    
            

        res.status(200).json({
            success: true,
            message: 'Country regions updated successfully',
        });

    } catch (error) {
        res.status(500).json({            
            success: false,
            message: 'Internal server error', 
        });
        console.error(`error while removing country regions: ${error}`)
    }
}


export const editCountryRegion = async(req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }
 
        const { countryName, region, newRegion } = req.body;
        console.log("add country req body: ", req.body)


        // validate data
        if (!region || !countryName ||!newRegion) {
            console.log("invalid country data", req.body)
            return res.status(400).json({
                success: false,
                message: 'weird data dude'
            });
        } 

         // validate data
        if (region === newRegion) {
            console.log("invalid country data", req.body)
            return res.status(400).json({
                success: false,
                message: 'weird data dude'
            });
        } 


        // find country
        const country = await Country.findOne({
            countryName: countryName
        });

        if (!country) {
            return res.status(400).json({
                success: false,
                message: "non existent country"
            })

        } else if (country) {
                
            // check if region exists
            const regionIndex = country.regions.findIndex(
                r => r.toString() === region
            );

            if (regionIndex === -1) {
                return res.status(400).json({
                    success: false,
                    message: "non existent region"
                })
            }

            // checking if new region name already exists
            const duplicateRegion = country.regions.some(
                region => region.toString() === newRegion.toString()
            );

            if (duplicateRegion) {
                return res.status(409).json({
                    success: false,
                    message: `Region "${newRegion}" already exists in ${countryName}`
                });
            }

            
            await Country.findOneAndUpdate(
                {
                    countryName: countryName,
                    'regions': region
                },
                {
                    $set: {
                        'regions$': newRegion
                    }
                },
                {
                    // runValidators: true  // Validates against schema
                }
            );
        }
                    
            

        res.status(200).json({
            success: true,
            message: 'Country region updated successfully',
        });

    } catch (error) {
        res.status(500).json({            
            success: false,
            message: 'Internal server error', 
        });
        console.error(`error while updating country regions: ${error}`)
    }
}





export const addRegionCities = async(req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }
 
        const { countryName, regionName, cities } = req.body;
        console.log("add region req body: ", req.body)


        // validate data
        if (!regionName || !countryName || !cities) {
            console.log("invalid region data", req.body)
            return res.status(400).json({
                success: false,
                message: 'weird data dude'
            });
        } 


        // find country
        const country = await Country.findOne({
            countryName: countryName
        });

        if (!country) {
            return res.status(400).json({
                success: false,
                message: "non existent country"
            })

        } 

        const region = Region.findOne({
            regionName: regionName
        })

        
        const existingRegion = country.regions.includes(regionName)

        // if region isnt already listed in the country's regions
        if (!existingRegion) {
            return res.status(400).json({
                success:false,
                message: `Region ${regionName} does not exist in the country ${countryName}.`
            })
        } 

        if(!region && existingRegion) {

            const newRegion = new Region({
                countryName: countryName,
                regionName: regionName,
                cities: cities,
            });

            const savedRegion = await newRegion.save()

        } else if (region && existingRegion) {
            
            // check if city already in region
            const existingCities = country.regions.map(item => item.toString());
            const newCities = cities.filter(
                city => !existingCities.includes(city.toString())
            )

            if (newCities.length > 0) {
                await Region.findOneAndUpdate({
                    regionName: regionName
                    },
                    {
                        $addToSet: { // prevents duplicates
                            cities: { 
                                $each: newCities
                            }
                        }
                    },
                    {
                        // runValidators: true  // Validates against schema
                    }
                );
            }
        }
        
                    
        res.status(200).json({
            success: true,
            message: region ? 'Region updated successfully' : 'Region added successfully',
        });

    } catch (error) {
        res.status(500).json({            
            success: false,
            message: 'Internal server error', 
        });
        console.error(`error while adding region: ${error}`)
    }
}




export const removeRegionCities = async(req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ 
                error: "psyche!!! hahaa!!" 
            });
        }
 
        const { countryName, regionName, cities } = req.body;
        console.log("remove region req body: ", req.body)


        // validate data
        if (!cities || !regionName || !countryName) {
            console.log("invalid region data", req.body)
            return res.status(400).json({
                success: false,
                message: 'weird data dude'
            });
        } 


        // find country
        const country = await Country.findOne({
            countryName: countryName
        });

        if (!country) {
            return res.status(400).json({
                success: false,
                message: "non existent country"
            })

        }

        const region = Region.findOne({
            regionName: regionName
        })

        if (!region) {
            return res.status(400).json({
                success: false,
                message: "non existent region"
            })

        }

        const existingRegion = country.regions.includes(regionName)

        // if region isnt already listed in the country's regions
        if (!existingRegion) {
            return res.status(400).json({
                success:false,
                message: `Region ${regionName} does not exist in the country ${countryName}.`
            })
        } 

        // clear all regions
        if (cities === "all") {
            await Region.findOneAndUpdate({
                regionName: regionName
                },
                {
                    $set: { 
                        cities: []
                    }
                },
                {
                    // runValidators: true  // Validates against schema
                }
            );
        
        // remove specific regions
        } else {
                
            // check if region is in country
            const existingCities = region.cities.map(item => item.toString());

            //only remove regions that actually exists
            const citiesToRemove = cities.filter(
                city => existingCities.includes(city.toString())
            )

            if (citiesToRemove.length > 0) {
                await Region.findOneAndUpdate({
                    regionName: regionName
                    },
                    {
                        $pull: { 
                            cities: { 
                                $in: citiesToRemove
                            }
                        }
                    },
                    {
                        // runValidators: true  // Validates against schema
                    }
                );
            }
            
        }
                    
            

        res.status(200).json({
            success: true,
            message: 'Country regions updated successfully',
        });

    } catch (error) {
        res.status(500).json({            
            success: false,
            message: 'Internal server error', 
        });
        console.error(`error while removing country regions: ${error}`)
    }
}


export const editRegionCity = async(req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }
 
        const { countryName, regionName, city, newCity } = req.body;
        console.log("add country req body: ", req.body)


        // validate data
        if (!regionName || !countryName || !newCity || !city) {
            console.log("invalid country data", req.body)
            return res.status(400).json({
                success: false,
                message: 'weird data dude'
            });
        } 

         // validate data
        if (city === newCity) {
            console.log("invalid region data", req.body)
            return res.status(400).json({
                success: false,
                message: 'weird data dude'
            });
        } 


        // find country
        const country = await Country.findOne({
            countryName: countryName
        });

        

        if (!country) {
            return res.status(400).json({
                success: false,
                message: "non existent country"
            })

        }

        const existingRegion = country.regions.includes(regionName)

        // if region isnt already listed in the country's regions
        if (!existingRegion) {
            return res.status(400).json({
                success:false,
                message: `Region ${regionName} does not exist in the country ${countryName}.`
            })
        } 

        const region = await Region.findOne({
            regionName: regionName
        });

        if (!region) {
            return res.status(400).json({
                success: false,
                message: "non existent region"
            })

        } else if (region) {
                
            // check if region exists
            const cityIndex = region.cities.findIndex(
                c => c.toString() === city.toString()
            );

            if (cityIndex === -1) {
                return res.status(400).json({
                    success: false,
                    message: "non existent city"
                })
            }

            // checking if new city name already exists
            const duplicateCity = region.cities.some(
                c => c.toString() === newCity.toString()
            );

            if (duplicateCity) {
                return res.status(409).json({
                    success: false,
                    message: `City "${newCity}" already exists in ${regionName}`
                });
            }

            
            await Region.findOneAndUpdate(
                {
                    regionName: regionName,
                    'cities': city
                },
                {
                    $set: {
                        'cities$': newCity
                    }
                },
                {
                    // runValidators: true  // Validates against schema
                }
            );
        }
                    
            

        res.status(200).json({
            success: true,
            message: 'Region city  updated successfully',
        });

    } catch (error) {
        res.status(500).json({            
            success: false,
            message: 'Internal server error', 
        });
        console.error(`error while updating region city: ${error}`)
    }
}