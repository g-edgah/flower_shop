import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
             
        req.user = verified;

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(500).json({ message: "Server error" });
    }
}

//this confirms if token exists from poll of tokens stored server side. this makes it vulnerable to attacks where an attacker has a valid token but uses it to access other accounts that arent their's