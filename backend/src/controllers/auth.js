import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

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

        // console.log('register req: ', req.body)

        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ error: "Missing required field(s)" });
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$_#^!%*?&])[A-Za-z\d@$_#^!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
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

        
        res.status(201).json({message: "registration successful"}); 
        console.log("new user created: "+savedUser)

    } catch (error) {
        res.status(500).json({message: 'error creating new user'})
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

        if (!email) return res.status(400).json({message: 'missing email'});
        if (!password) return res.status(400).json({message: 'missing password'});

        //generic error message to prevent enumeration. subtle time differences might still allow enumeration
        
        const user = await User.findOne({ "email.email": email });
        if (!user) {
            // console.log("wrong email. provided email: ", email )
            return res.status(400).json({ message: 'wrong email or password' });

        }

        const passwdMatch = await bcrypt.compare(password, user.password.password);
        if (!passwdMatch) {
            return res.status(400).json({ message: 'wrong email or password' });
        }


        if (passwdMatch) {
            console.log("user logged in: "+user.firstName)
        }

        const token = jwt.sign(
            { id : user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '7 days' }
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
        res.status(500).json({message: 'login error'})
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
            message: 'Logout failed' 
        });
    }
}