import { jwtServices } from "../../shared/jwt.services";

export function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: "Authentication token is required" });
  }
  const isValid = jwtServices.verify(token);
  if (isValid) {
    req.user = decoded;
    next();
  }
  return res.status(403).json({ message: "Invalid token" });
};



