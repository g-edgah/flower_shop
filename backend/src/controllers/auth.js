import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import DeletedUser from '../models/deletedUser.js';

import { mergeCarts } from './user/cart.js'
import { mergeWishlists } from './user/wishlist.js'

//new user registration
export const register = async (req, res) => {
    //console.log('recieved'+req)
    try {
        console.log('recieved: '+req.body.firstName)
        const {
            email,
            password,
            confirmPassword
        } = req.body

         console.log('register req: ', req.body)

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ 
                errorType: "general",
                error: "Missing required field(s)" 
            });
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ 
                errorType: "email",
                error: "Invalid email format" 
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ 
                errorType: "password",
                error: "Passwords do not match" 
            });
        }

        // password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$_#^!%*?&])[A-Za-z\d@$_#^!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                errorType: "password",
                error: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character" 
            });
        }

        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log('here')
        const newUser = new User({
            email: {email: email},
            password: { password: passwordHash },
        });

        const savedUser = await newUser.save()

        
        res.status(201).json({
            message: "registration successful"
        }); 
        console.log("new user created: "+savedUser)

    } catch (error) {
        res.status(500).json({
            errorType: "general",
            message: 'error creating new user'
        })
        console.log("error in register function: "+error)
        
    }
}


//login
export const login = async (req, res) => {
    try {

        //console.log('login request recieved: '+req.body.email)
        const {
            email,
            password,
            cart,
            wishlist
        } = req.body;

        console.log('login req: ', req.body)

        if (!email || !password) return res.status(400).json({ 
            errorType: "general",
            error: 'missing email or password'
        });
        

        //generic error message to prevent enumeration. subtle time differences might still allow enumeration
        
        const user = await User.findOne({ "email.email": email });
        if (!user) {
            // console.log("wrong email. provided email: ", email )
            return res.status(400).json({ 
                errorType: "general",
                error: 'wrong email or password' 
            });

        }

        const passwdMatch = await bcrypt.compare(password, user.password.password);
        if (!passwdMatch) {
            return res.status(400).json({ 
                errorType: "general",
                error: 'wrong email or password' 
            });
        }


        if (passwdMatch) {
            console.log("user logged in: "+user.firstName)
        }

        const token = jwt.sign(
            { 
                id : user._id, 
                role: user.role 
            }, 
            process.env.JWT_SECRET,
            { 
                expiresIn: '7 days',
                algorithm: 'HS256',
             }
        );

        //console.log("generated token: "+token)
        
        //set cookie in response
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // set secure flag in production
            sameSite: 'strict', // prevent CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
        })

        // merge wishlist and cart
        const userId = user._id
        mergeWishlists(userId, wishlist)
        mergeCarts(userId, cart)

        // Send response to client
        res.status(200).json({ 
            message: "Login successful",
            userId: user._id 
        });

        
    } catch (error) {
        console.log("error logging in: "+error);
        res.status(500).json({ 
            errorType: "general",
            error: 'login error' 
        })
    }

}

export const logout = async (req, res) => {
    console.log("logout request recieved")
        try {
        // clear the HttpOnly cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        
        res.status(200).json({ 
            success: true, 
            message: 'Logged out successfully' 
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false, 
            errorType: "general",
            message: 'Logout failed' 
        });
    }
}

// edit sensitive user details
export const editUserPassword = async (req, res) => {
    try {
        const { id } = req.user

        const paramId = req.params.id

        if (paramId !== id) {
            return res.status(403).json({ error: "psyche!!! hahaa!!" });
        }

        const { 
            currentPassword, 
            newPasswordOne, 
            newPasswordTwo 
        } = req.body;

        const password = currentPassword.trim()
        const passwordOne = newPasswordOne.trim()
        const passwordTwo = newPasswordTwo.trim()

        console.log("edit password req recieved: ", req.body)

        // validate that all password fields are provided
        if (!password || !passwordOne || !passwordTwo) {
            return res.status(400).json({ 
                errorType: "general",
                error: "All password fields are required" 
            });
        }

        // check if new passwords match
        if (passwordOne !== passwordTwo) {
            return res.status(400).json({ 
                errorType: "general",
                error: "New passwords do not match" 
            });
        }

        // password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$_#^!%*?&])[A-Za-z\d@$_#^!%*?&]{8,}$/;
        if (!passwordRegex.test(passwordOne)) {
            return res.status(400).json({ 
                errorType: "general",
                error: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character" 
            });
        }


        // Find the user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                errorType: "general", 
                error: "User not found" 
            });
        }

        // check if current password matches
        const isPasswordValid = await bcrypt.compare(password, user.password.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                errorType: "currentPassword",
                error: "Current password is incorrect" 
            });
        }

        // prevent reusing the same password
        const isSamePassword = await bcrypt.compare(passwordOne, user.password.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                errorType: "password",
                error: "New password cannot be the same as current password" 
            });
        }

        // hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(passwordOne, salt);

        // update user's password
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { 
                password: {
                    password: hashedPassword
                } 
            },
            {           
                runValidators: false
            }
        );

        // optionally, clear any sessions or tokens

        return res.status(200).json({ 
            message: "Password updated successfully" 
        });


    } catch (error) {
        res.status(500).json({ 
            errorType: "general",
            error: "error while updating user details" 
        });
        console.error(`error while updating user details: ${error}`)
    }
}


//edit user email
export const editUserEmail = async (req, res) => {
    try {
        const { id } = req.user;
        const paramId = req.params.id;

        // Verify user is editing their own email
        if (paramId !== id) {
            return res.status(403).json({ 
                error: "You are not authorized to edit this user's email" 
            });
        }

        const { email, password } = req.body;

        console.log("edit email req recieved: ", req.body)

        const emailTrimmed = email?.trim()
        const passTrimmed = password.trim()

        // validate that both fields are provided
        if (!emailTrimmed || !password) {
            return res.status(400).json({ 
                errorType: "general",
                error: "Email and password are required" 
            });
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailTrimmed)) {
            return res.status(400).json({ 
                errorType: "general",
                error: "Please provide a valid email address" 
            });
        }

        // find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                errorType: "general",
                error: "User not found" 
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(passTrimmed, user.password.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                errorType: "password",
                error: "Incorrect password" 
            });
        }

        // check if the new email is already in use by another user
        const existingUser = await User.findOne({ 
            'email.email': emailTrimmed.toLowerCase(),
            _id: { $ne: id } // exclude current user
        });
        
        // note this allows for email enumeration. take steps such as daily limits or blocking devices/ips that attempt enumeration to prevent enumeration
        if (existingUser) {
            return res.status(409).json({ 
                errorType: "email",
                error: "Email is already registered to another account" 
            });
        }

        // Check if the new email is the same as the current one
        if (user.email.email.toLowerCase() === emailTrimmed.toLowerCase()) {
            return res.status(400).json({ 
                errorType: "email",
                error: "New email is the same as the current email" 
            });
        }

        

        // Update the email
        // user.email = emailTrimmed.toLowerCase(); // Normalize to lowercase
        // user.emailUpdatedAt = new Date(); // Optional: track when email was updated
        
        // If you want to require email verification again
        // user.isEmailVerified = false;
        // user.emailVerificationToken = crypto.randomBytes(32).toString('hex');
        // user.emailVerificationTokenExpiry = Date.now() + 3600000; // 1 hour

        // await user.save();

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { 
                email: {
                    email: emailTrimmed.toLowerCase()
                }
            },
            {           
                runValidators: false
            }
        );

        // Optional: Send confirmation email to old and/or new address
        // await sendEmailNotification(user.email, 'Email changed successfully');

        if (updatedUser) {
            return res.status(200).json({ 
                message: "Email updated successfully",
            });
        }

    } catch (error) {
        console.error("Error updating email:", error);
        return res.status(500).json({ 
            errorType: "general",
            error: "Internal server error" 
        });
    }
};


// delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.user;
        const paramId = req.params.id;

        // Verify user is editing their own email
        if (paramId !== id) {
            return res.status(403).json({ 
                error: "You are not authorized to delete this user" 
            });
        }

        const { password, reason } = req.body;

        console.log("delete user req received: ", req.body)

        const passTrimmed = password.trim()

        // validate that both fields are provided
        if (!password) {
            return res.status(400).json({ 
                errorType: "general",
                error: "Password is required" 
            });
        }


        // find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ 
                errorType: "general",
                error: "User not found" 
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(passTrimmed, user.password.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                errorType: "password",
                error: "Incorrect password" 
            });
        }

        const newDeletedUser = new DeletedUser({
            userId: id,
            reason: reason.trim(),
            role: user?.role,
        });

        const savedDeletedUser = await newDeletedUser.save()


        const deletedUser = await User.findByIdAndDelete(id);

        if (deletedUser) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/'
            });
            
            return res.status(200).json({ 
                message: "User deleted successfully",
            });
        }

    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ 
            errorType: "general",
            error: "Internal server error" 
        });
    }
};