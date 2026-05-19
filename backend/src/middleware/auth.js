import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
             
        req.user = verified;

        //console.log("verified token for user id: "+req.user.id)

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

export const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
             
        req.user = verified;

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized" });
        }

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
