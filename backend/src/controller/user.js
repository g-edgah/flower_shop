import User from "../models/user.js";
import Product from "../models/product.js";

export const getUser = async (req, res) => {
    try {
        //use id from verified token instead of url param to prevent enumeration and ensure users can only access their own data
        const { id } = req.user;

        //also get id from params(to mess with those burpsuite warriors)
        const paramId = req.params.id

        // console.log("req.user: "+id+" paramId: "+paramId)

        //let's send a fun error message if someone tries to access another user's data just for kicks and send them on a wild goose chase 
        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        // option 1
        // const user = await User.findById(id);
        // const { _id, firstName, lastName, location, picturePath } = user;

        //option 2
        const user = await User.findById(id)
            //.populate('cart.product')
            //.populate('orders')
            //.populate('favorites')
            .select('-password'); 
        
        //console.log("user: "+user)

        const formattedUser = { 
            _id: user._id, 
            email: user.email,
            firstName: user.firstName, 
            lastName: user.lastName, 
            address: user.address, 
            picturePath: user.picturePath,
            cart: user.cart,
            wishlist: user.wishlist,
            orders: user.orders,
        };

        res.status(200).json({ formattedUser });

    } catch (error) {
        res.status(404).json({error: "error while fetching user" });
        console.log(`error while fetching user: ${error}`)
    }
}


// edit non-sensitive user details
export const editUser = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { 
            firstName, 
            lastName, 
            address 
        } = req.body;

        console.log("edit user req body address: ",req.body.address)

        // if (newPassword !== confirmPassword) {
        //     res.status(400).json({error: "passwords do not match"})
        //     return
        // }

        // if (currentPassword === newPassword) {
        //     res.status(400).json({error: "new and current passsword cannot be the same"})
        //     return
        // } //this compares from user input rather than from database to prevent password enumeration


        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, address },
            { returnDocument: true }
        ).select('-password');

        res.status(200).json({ message: 'success'}) //you can use a simple message then use getUser to fetch the updataed user cause it has security configured

    } catch (error) {
        res.status(500).json({ error: "error while updating user details" });
        console.log(`error while updating user details: ${error}`)
    }
}


//if you go for option 1. get user cart
export const getUserCart = async (req, res) => {
    try {
        //use id from verified token instead of url param to prevent enumeration and ensure users can only access their own data
        const { id } = req.user

         //also get id from params(to mess with those burpsuite warriors)/
        const paramId = req.params.id

        //let's send a fun error message if someone tries to access another user's data just for kicks and send them on a wild goose chase 
        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const user = await User.findById(id).populate('cart.product'); //populate product details in cart

        console.log("user cart: ", user.cart)

        // console.log(user.cart.map(i => ({
        //     product: i.product,
        //     productModel: i.productModel
        // })));

        // console.log(
        //     User.schema.path('cart').schema.path('product').options
        // );

        const formattedCart = user.cart.map( ({ 
            product: { _id, name, price, description, picturePath },
            quantity
        }) => {
            return { _id, name, price, description, picturePath, quantity }
        })

        res.status(200).json({ formattedCart })
    } catch (error) {
        res.status(404).json({ error: "error while fetching user cart" });
        console.log(`error while fetching user cart: ${error}`)
    }
}


// edit user cart
export const editCartItem = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { productId, productModel,quantity } = req.body;

        // validate quantity
        if (!quantity || quantity < 1 || quantity > 999) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be between 1 and 999'
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


        // check if product already in cart
        const existingCartItem = user.cart.findIndex(item => item.product.toString() === productId);

        if (existingCartItem !== -1) {
            // find user and update the specific cart item quantity
            const user = await User.findOneAndUpdate(
                { 
                    _id: id, 
                    'cart.product': productId 
                },
                { 
                    $set: { 'cart.$.quantity': quantity } 
                },
                { 
                    returnDocument: 'after', // return updated document
                    runValidators: true // run schema validators
                }
            )
        } else {
            // if product not in cart, add it with the specified quantity
            const user = await User.findByIdAndUpdate(
                id,
                {
                    $push: {
                        cart: {
                            product: productId,
                            productModel: productModel,
                            quantity: quantity
                        }
                    }
                },
                {
                    returnDocument: 'after',  // returns updated document
                    runValidators: true  // vlidates against schema
                }
            );
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found or product not in cart'
            });
        }

        res.status(200).json({ message: 'success'}) //you can use a simple message then use getUser to fetch the updataed user cause it has security configured

    } catch (error) {
        res.status(500).json({ error: "error while updating user details" });
        console.log(`error while updating user details: ${error}`)
    }
}

export const addCartItem = async (req, res, next) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }
 
        const { productId, quantity, productModel } = req.body;

        // validate quantity
        if (!quantity || quantity < 1 || quantity > 999) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be between 1 and 999'
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
        //console.log("user confirmed: ",user.firstName)

        // check if product already in cart
        const existingCartItem = user.cart.findIndex(item => item.product.toString() === productId);

        // console.log("existingCartItem index: ", existingCartItem)

        if (existingCartItem !== -1) {
            const newQuantity = user.cart[existingCartItem].quantity + quantity;
            //console.log("item already exists in cart");
            //console.log("new quantity: "+newQuantity)   


            if (!newQuantity || newQuantity < 1 || newQuantity > 999) {
                return res.status(400).json({
                    success: false,
                    message: 'Total quantity must be between 1 and 999'
                });
            }   
            
            await User.findOneAndUpdate(
                { 
                    _id: id, 
                    'cart.product': productId 
                },
                { 
                    $set: { 'cart.$.quantity': newQuantity } 
                },
                { 
                    returnDocument: 'after', // return updated document
                    runValidators: true // run schema validators
                }
            )


        } else {
            //console.log("item does not exist in cart");
            await User.findByIdAndUpdate(
                id,
                {
                    $push: {
                        cart: {
                            product: productId,
                            productModel: productModel,
                            quantity: quantity
                        }
                    }
                },
                {
                    new: true,  // Returns updated document
                    runValidators: true  // Validates against schema
                }
            );
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

export const minusCartItem = async (req, res, next) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }
 
        const { productId, quantity } = req.body;

        // validate quantity
        if (!quantity || quantity < 1 || quantity > 999) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be between 1 and 999'
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
        //console.log("user confirmed: ",user.firstName)

        // check if product already in cart
        const existingCartItem = user.cart.findIndex(item => item.product.toString() === productId);

        // console.log("existingCartItem index: ", existingCartItem)

        if (existingCartItem !== -1) {
            const newQuantity = user.cart[existingCartItem].quantity - quantity;
            //console.log("item already exists in cart");
            //console.log("new quantity: "+newQuantity)   


            if (!newQuantity || newQuantity < 1 || newQuantity > 999) {
                return res.status(400).json({
                    success: false,
                    message: 'Total quantity must be between 1 and 999'
                });
            }   
            
            await User.findOneAndUpdate(
                { 
                    _id: id, 
                    'cart.product': productId 
                },
                { 
                    $set: { 'cart.$.quantity': newQuantity } 
                },
                { 
                    returnDocument: 'after', // return updated document
                    runValidators: true // run schema validators
                }
            )


        } else {
            //console.log("item does not exist in cart");
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
            
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

export const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { productId } = req.body;

        const user = await User.findByIdAndUpdate(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // check if product exists in cart
        const itemExists = user.cart.some(
            item => item.product.toString() === productId
        );

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in cart'
            });
        }

        // remove item 
        await User.findByIdAndUpdate(
            id,
            { $pull: { cart: { product: productId } } }
        );

        res.status(200).json({ message: 'success'}) //you can use a simple message then use getUser to fetch the updataed user cause it has security configured

    } catch (error) {
        res.status(500).json({ error: "error while deleting cart item" });
        console.log(`error while deleting cart item: ${error}`)
    }
}
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
        console.log(`error while fetching user wishlist: ${error}`)
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
        console.log("productId: ", req.body)

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
        console.log("user wishlist before update: ", user.wishlist)
        // check if product exists in wishlist
        const itemExists = user.wishlist.some(
            item => item.toString() === productId
        );
        console.log("item exists in wishlist: ", itemExists)
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
                    returnDocument: 'after',  // returns updated document
                    runValidators: true  // validates against schema
                }
            );
        
            console.log("user wishlist after adding item: ", await User.findById(id).select('wishlist'))
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
                    returnDocument: 'after',  // returns updated document
                    runValidators: true  // validates against schema
                }
            );
        }

        res.status(200).json({ 
            message: 'success'
        }) 

    }catch (error) {
        res.status(500).json({ error: "error while updating wishlist" });
        console.log(`error while updating wishlist: ${error}`)
    }
}   