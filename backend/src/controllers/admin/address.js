import Country from '../../models/countrySchema.js';
import Region from '../../models/regionSchema.js';


const addCountry = () => {
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
            return res.status(500).json({
                success: false,
                message: 'weird data dude'
            });
        } 


        // find user
        const country = await Country.find({
            countryName: countryName
        });

        if (!country) {
            const newCountry = new Country({
                countryName: country,
                regions: regions,
            });

            const savedCountry = await newCountry.save()

        } else if (country) {
            regions.map((region) => {
                
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
                            $push: {
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
            })
        }
                    
            

        res.status(200).json({
            success: true,
            message: existingCartItem !== -1 ? 'Cart updated successfully' : 'Item added to cart successfully',
        });

    } catch (error) {
        res.status(500).json({            
            success: false,
            message: 'Internal server error', 
        });
        console.error(`error while adding cart item: ${error}`)
    }
}