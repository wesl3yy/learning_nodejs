import bcrypt from 'bcrypt';

class BcryptServices {
  constructor(bcryptjs) {
    this.bcryptjs = bcryptjs;
  }

  /**
   * @param {string} password 
   * @returns {string}
   */
  async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  /**
   * @param {string} password 
   * @param {string} hashPw 
   * @returns {boolean}
   */
  async compare(password, hashPw) {
    const isValid = await bcrypt.compare(password, hashPw);
    return isValid;
  }
}

export const bcryptServices = new BcryptServices(bcrypt);