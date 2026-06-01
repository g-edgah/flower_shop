import User from "../../models/user.js";
import Product from "../../models/product.js";

export const getUserWishlist = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const user = await User.findById(id);

        const wishlist = user.wishlist.map(item => item.toString())

        res.status(200).json({ wishlist })
    } catch (error) {
        res.status(404).json({ error: "error while fetching user wishlist" });
        console.error(`error while fetching user wishlist: ${error}`)
    }
}

export const editUserWishlist = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { productId } = req.body;
        // console.log("productId: ", req.body)

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const user = await User.findByIdAndUpdate(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // console.log("user wishlist before update: ", user.wishlist)
        // check if product exists in wishlist
        const itemExists = user.wishlist.some(
            item => item.toString() === productId
        );
        // console.log("item exists in wishlist: ", itemExists)
        // add item
        if (!itemExists) {
            console.log("adding item to wishlist", productId);
            await User.findByIdAndUpdate(
                id,
                {
                    $addToSet: {
                        wishlist:  productId
                    }
                },
                {
                    runValidators: true  // validates against schema
                }
            );
        
            //console.log("user wishlist after adding item: ", await User.findById(id).select('wishlist'))
        } else if (itemExists) {
            console.log("removing item from wishlist");
            // remove item 
            await User.findByIdAndUpdate(
                id,
                { 
                    $pull: { 
                        wishlist: productId 
                    } 
                },
                {
                    runValidators: true  // validates against schema
                }
            );
        }

        res.status(200).json({ 
            message: 'success'
        }) 

    }catch (error) {
        res.status(500).json({ error: "error while updating wishlist" });
        console.error(`error while updating wishlist: ${error}`)
    }
}   