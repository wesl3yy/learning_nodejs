import jwt from 'jsonwebtoken';
import { configServices } from '../config.js';

class JwtServices {
  constructor(jwt) {
    this.jwt = jwt;
  }

  secretKey = configServices.getJWTConfig().jwtSecret;
  expiresIn = configServices.getJWTConfig().expiresIn;
  /**
   * @returns { string }
   */
  encode(payload) {
    const result = jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
    return result;
  }

  /**
   * 
   * @returns { boolean }
   */
  verify(token) {
    try {
      jwt.verify(token, this.secretKey);
      return true;
    } catch {
      return false;
    }

  }
}

export const jwtServices = new JwtServices(jwt);