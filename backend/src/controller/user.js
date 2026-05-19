import User from "../models/user.js";
import Product from "../models/product.js";

export const getUser = async (req, res) => {
    try {
        //use id from verified token instead of url param to prevent enumeration and ensure users can only access their own data
        const { id } = req.user;

        //also get id from params(to mess with those burpsuite warriors)
        const paramID = req.params.id

        //let's send a fun error message if someone tries to access another user's data just for kicks and send them on a wild goose chase 
        if (paramID !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        // option 1
        // const user = await User.findById(id);
        // const { _id, firstName, lastName, location, picturePath } = user;

        //option 2
        const user = await User.findById(userId)
            .populate('cart.product')
            .populate('orders')
            .populate('favorites')
            .select('-password'); 

        const formattedUser = { 
            _id, 
            firstName, 
            lastName, 
            location, 
            picturePath, 
            cart: user.cart
        };

        res.status(200).json({ formattedUser });

    } catch (error) {
        res.status(404).json({error: "error while fetching user" });
        console.log(`error while fetching user: ${error}`)
    }
}

//if you go for option 1
// export const getUserCart = async (req, res) => {
//     try {
//         //use id from verified token instead of url param to prevent enumeration and ensure users can only access their own data
//         const { id } = req.user

//          //also get id from params(to mess with those burpsuite warriors)
//         const paramID = req.params.id

//         //let's send a fun error message if someone tries to access another user's data just for kicks and send them on a wild goose chase 
//         if (paramID !== id) {
//             return res.status(403).json({ error: "psyche!!! hahaa!!" });
//         }

//         const user = await User.findById(id);

//         //option 1
//         const cart = await Product.find({
//             _id: { $in: user.cart }
//         });


//         const formattedCart = cart.map( ({ _id, name, price, description, picturePath }) => {
//             return { _id, name, price, description, picturePath }
//         })

//         res.status(200).json({ formattedCart })
//     } catch (error) {
//         res.status(404).json({ error: "error while fetching user cart" });
//         console.log(`error while fetching user cart: ${error}`)
//     }
// }