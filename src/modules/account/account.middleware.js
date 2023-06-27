import jwt from "jsonwebtoken";
import { ConfigServices } from "../../config";

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: "Authentication token is required" });
  }
  const configServices = new ConfigServices(process.env);
  const jwt_secret = configServices.getJWTConfig().jwtSecret;
  jwt.verify(token, jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};



