import User from "../../models/user.js";
import Product from "../../models/product.js";

export const getUserWishlist = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const user = await User.findById(id).populate('wishlist.product');

        // const initialWishlist = user.wishlist
        // //console.log("wishlist user: ", user.wishlist)
        // const orderedWishlist = initialWishlist.sort({addedAt: -1 })
        const wishlist = user.wishlist.map( ({ 
            product: { _id, name, type, price, description, picturePath, inStock  },
        }) => {
            return { 
                _id, 
                name, 
                type, 
                price,
                description, 
                picturePath, 
                inStock: inStock > 0 ? true : false,
            }
        })

        

        res.status(200).json({ wishlist })
    } catch (error) {
        res.status(404).json({ error: "error while fetching user wishlist" });
        console.error(`error while fetching user wishlist: ${error}`)
    }
}

export const editWishlist = async (req, res, next) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }
 
        const { productId, productModel } = req.body;
        console.log("edit wishlist req body: ", req.body)

        // validate productmodel
        if (!productModel || (productModel !== 'Bouquet' && productModel !== 'Flower')) {
            //console.log("invalid productModel:, ", productModel)
            return res.status(500).json({
                success: false,
                message: 'weird data dude'
            });
        } 

        

        // find user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        

        // check if product already in wishlist
        const existingWishlisttItem = user.wishlist.findIndex(item => item.product.toString() === productId);

        

        // console.log("existingWishlisttItem index: ", existingCartItem)

        if (existingWishlisttItem !== -1) {
            
            // remove item 
            await User.findByIdAndUpdate(
                id,
                { 
                    $pull: { wishlist: { 
                        product: productId 
                    } 
                } 
            }
            );
            console.log("item removed from wishlist")


        } else {
            
            //add item
            await User.findByIdAndUpdate(
                id,
                {
                    $push: {
                        wishlist: {
                            product: productId,
                            productModel: productModel
                        }
                    }
                },
                {
                    runValidators: true  // Validates against schema
                }
            );
            console.log("item added to wishlist")
        }
        

        res.status(200).json({
            success: true,
            message: existingWishlisttItem !== -1 ? 'Item removed from wishlist successfully' : 'Item added to wishlist successfully',
        });

    } catch (error) {
        res.status(500).json({            
            success: false,
            message: 'Internal server error', 
        });
        console.error(`error while adding wishlist item: ${error}`)
    }
}