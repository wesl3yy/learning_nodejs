require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token){
        return res.status(403).json({message: "Authentication token is required"});
    }
    jwt.verify(token, jwt_secret, (err, decoded) => {
        if (err) {
            return res.status(403).json({message: "Invalid token"});
        }
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;
