
const jwt = require("jsonwebtoken");
const configServices = require("../../config");

const jwt_secret = configServices.getJWTConfig().jwtSecret;

// 1 function truyen vao err, req, res, next la 1 middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: "Authentication token is required" });
  }
  jwt.verify(token, jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
