import User from "../../models/user.js";
import Product from "../../models/product.js";


export const getUserCart = async (req, res) => {
    console.log("get cart request received")
    try {
        //use id from verified token instead of url param to prevent enumeration and ensure users can only access their own data
        const { id } = req.user
        // console.log('id for user: ', id)

         //also get id from params(to mess with those burpsuite warriors)/
        const paramId = req.params.id

        //let's send a fun error message if someone tries to access another user's data just for kicks and send them on a wild goose chase 
        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const user = await User.findById(id).populate('cart.product'); //populate product details in cart

        // console.log("user cart: ", user.cart)

        // console.log(user.cart.map(i => ({
        //     product: i.product,
        //     productModel: i.productModel
        // })));

        // console.log(
        //     User.schema.path('cart').schema.path('product').options
        // );

        //console.log("cart user: ", user.cart)
        const formattedCart = user.cart.map( ({ 
            product: { _id, name, price, description, picturePath },
            quantity
        }) => {
            return { 
                _id, 
                name, 
                price, 
                description, 
                picturePath, 
                quantity,
                subTotal: price * quantity
            }
        })

        //subTotal
        const subTotal = formattedCart.reduce((sum, item) => sum + item.subTotal, 0)

        //shipping cost
        const region = user.address?.region?.toLowerCase() || "unknown region";

        const shippingCost = region === 'nairobi' ? 300 : 800

        //grand total
        const grandTotal = subTotal + shippingCost


        res.status(200).json({ 
            formattedCart,
            subTotal,
            shippingCost,
            grandTotal
        })

        

    } catch (error) {
        res.status(404).json({ error: "error while fetching user cart" });
        console.error(`error while fetching user cart: ${error}`)
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
        console.log("addcart req body: ", req.body)

        // validate quantity
        if (!quantity || quantity < 1 || quantity > 999) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be between 1 and 999'
            });
        }   

        // validate productmodel
        if (!productModel || (productModel !== 'Bouquet' && productModel !== 'Flower')) {
            console.log("invalid productModel:, ", productModel)
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
        const productId = req.params.productId

        console.log("deleting item: ", productId)
        console.log("deleting for user: ", id)

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

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
        console.log("item removed from cart")

        res.status(200).json({ message: 'success'}) //you can use a simple message then use getUser to fetch the updataed user cause it has security configured

    } catch (error) {
        res.status(500).json({ error: "error while deleting cart item" });
        console.error(`error while deleting cart item: ${error}`)
    }
}
