import { GeneralError } from "../../common/general";
import { jwtServices } from "../../shared/jwt.services";
import { UserServices } from "../user/user.services";

/**
 * @param {UserServices} userServices 
 */
export function authMiddleware(userServices) {
  return async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).json({ message: "Authentication token is required" });
    }
    const payload = token.substr('Bearer '.length);
    const isValid = jwtServices.verify(payload);
    if (isValid) {
      const { id } = isValid;
      const user = await userServices.findById(id);
      req.user = user;
      next();
    } else {
      return res.status(403).json({ message: "Invalid token" });
    }
  }
};



