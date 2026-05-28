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
            userName: user.userName, 
            address: user.address, 
            picturePath: user.picturePath 
            //cart: user.cart
        };

        res.status(200).json({ formattedUser });

    } catch (error) {
        res.status(404).json({error: "error while fetching user" });
        console.log(`error while fetching user: ${error}`)
    }
}

//if you go for option 1
export const getUserCart = async (req, res) => {
    try {
        //use id from verified token instead of url param to prevent enumeration and ensure users can only access their own data
        const { id } = req.user

         //also get id from params(to mess with those burpsuite warriors)
        const paramId = req.params.id

        //let's send a fun error message if someone tries to access another user's data just for kicks and send them on a wild goose chase 
        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const user = await User.findById(id);

        //option 1
        const cart = await Product.find({
            _id: { $in: user.cart }
        });


        const formattedCart = cart.map( ({ 
            _id, 
            name, 
            price, 
            description, 
            picturePath 
        }) => {
            return { _id, name, price, description, picturePath }
        })

        res.status(200).json({ formattedCart })
    } catch (error) {
        res.status(404).json({ error: "error while fetching user cart" });
        console.log(`error while fetching user cart: ${error}`)
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

// edit user cart
export const editUserCart = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { firstName, lastName, userName, mobile, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, userName, mobile, address },
            { new: true }
        ).select('-password');

        res.status(200).json({ message: 'success'}) //you can use a simple message then use getUser to fetch the updataed user cause it has security configured

    } catch (error) {
        res.status(500).json({ error: "error while updating user details" });
        console.log(`error while updating user details: ${error}`)
    }
}