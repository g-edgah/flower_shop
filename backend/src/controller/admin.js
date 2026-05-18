import user from "../models/user.js";
import Product from "../models/product.js";

export const addProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        const { _id, firstName, lastName, location, picturePath } = user;
        const formattedUser = { _id, firstName, lastName, location, picturePath };

        res.status(200).json({ formattedUser });

    } catch (error) {
        res.status(404).json({error: "error while fetching user" });
        console.log(`error while fetching user: ${error}`)
    }
}

export const removeProduct = async (req, res) => {
    try {
        const { id } = req.params

        const user = await User.findById(id);

        const cart = await Promise.all(
            user.cart.map((id) => Product.findById(id))
        )

        const formattedCart = cart.map( ({ _id, name, price, description, picturePath }) => {
            return { _id, name, price, description, picturePath }
        })

        res.status(200).json({ formattedCart })
    } catch (error) {
        res.status(404).json({ error: "error while fetching user cart" });
        console.log(`error while fetching user cart: ${error}`)
    }
}