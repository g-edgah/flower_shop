import User from "../../models/user.js";
import Product from "../../models/product.js";

export const getUser = async (req, res) => {
    console.log("get user request received")
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
            .populate('cart.product')
            //.populate('orders')
            //.populate('wishlist')
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

        res.status(200).json({ 
            formattedUser 
        });

    } catch (error) {
        res.status(404).json({error: "error while fetching user" });
        console.error(`error while fetching user: ${error}`)
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

        //console.log("edit user req body address: ",req.body.address)

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
            { firstName, lastName, address }
        ).select('-password');

        res.status(200).json({ message: 'success'}) //you can use a simple message then use getUser to fetch the updataed user cause it has security configured

    } catch (error) {
        res.status(500).json({ error: "error while updating user details" });
        console.error(`error while updating user details: ${error}`)
    }
}


// edit sensitive user details
export const editSensitiveUser = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { 
            password: currentPassword, 
            newPassword: newPasswordOne, 
            confirmPassword: newPasswordTwo 
        } = req.body;

        // validate that all password fields are provided
        if (!currentPassword || !newPasswordOne || !newPasswordTwo) {
            return res.status(400).json({ 
                error: "All password fields are required" 
            });
        }

        // check if new passwords match
        if (newPasswordOne !== newPasswordTwo) {
            return res.status(400).json({ 
                error: "New passwords do not match" 
            });
        }

        // password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPasswordOne)) {
            return res.status(400).json({ 
                error: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character" 
            });
        }


        // Find the user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // check if current password matches
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                error: "Current password is incorrect" 
            });
        }

        // prevent reusing the same password
        const isSamePassword = await bcrypt.compare(newPasswordOne, user.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                error: "New password cannot be the same as current password" 
            });
        }

        // hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPasswordOne, salt);

        // update user's password
        user.password = hashedPassword;
        await user.save();

        // optionally, clear any sessions or tokens

        return res.status(200).json({ 
            message: "Password updated successfully" 
        });


    } catch (error) {
        res.status(500).json({ error: "error while updating user details" });
        console.error(`error while updating user details: ${error}`)
    }
}