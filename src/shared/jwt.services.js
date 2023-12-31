import jwt from 'jsonwebtoken';
import { configServices } from '../config';

class JwtServices {
  secretKey = configServices.getJWTConfig().jwtSecret;
  expiresIn = configServices.getJWTConfig().expiresIn;

  constructor(jwt) {
    this.jwt = jwt;
  }

  /**
   * @returns { string }
   */
  encode(payload) {
    const result = jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
    return result;
  }

  /**
   * @param {string} token 
   * @returns { boolean }
   */
  verify(token) {
    try {
      jwt.verify(token, this.secretKey);
      return jwt.decode(token);
    } catch {
      return false;
    }

  }
}

export const jwtServices = new JwtServices(jwt);