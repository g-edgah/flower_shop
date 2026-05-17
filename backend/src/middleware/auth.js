import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header('Authorization');

        if  (!token) {
            return res.status(403).send('Unauthorized')

        }

        if (token.startsWith('Bearer')) {
            token = token.slice(7, token.length).trimLeft();

        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
             
        req.user = verified;

        next();

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//this confirms if token exists from poll of tokens stored server side. this makes it vulnerable to attacks where an attacker has a valid token but uses it to access other accounts that arent their's