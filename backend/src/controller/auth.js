import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';


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

        if (password !== confirmPassword) {
            res.status(400).json({error: "passwords do not match"})
            return
        }

        // const salt = await bcrypt.genSalt();
        // const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password,//: passwordHash,
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
        } = req.body;

        if (!email) return res.status(400).json({message: 'missing email'});
        if (!password) return res.status(400).json({message: 'missing password'});

        //generic error message to prevent enumeration. subtle time differences might still allow enumeration
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ message: 'wrong email or password' });

        const passwdMatch = await bcrypt.compare(password, user.password);
        if (!passwdMatch) return res.status(400).json({ message: 'wrong email or password' });
        // if (passwdMatch) {
        //     console.log("user logged in: "+user.firstName)
        // }

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