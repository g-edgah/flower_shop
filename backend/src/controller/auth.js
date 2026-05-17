import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';


//new user registration
export const register = async (req, res) => {
    //console.log('recieved'+req)
    try {
        const {
            firstName, 
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occcupation 

        } = req.body

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, 
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location
        });

        const savedUser = await newUser.save()
        res.status(201).json(savedUser); 

    } catch (error) {
        res.status(500).json({message: 'error creating new user'})
        console.log("error in register function: "+error)
        
    }
}


//login
export const login = async (req, res) => {
    try {
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

        const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET);
        
        //to avoid sending back the password
        const userObject = user.toObject();  // or user.toJSON()
        delete userObject.password;
        res.status(200).json({ token, user: userObject });
        
    } catch (error) {
        console.log("error logging in: "+error);
        res.status(500).json({message: 'login error'})
    }

}