require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GeneralError } = require("../../common/general");

class AccountServices {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async create(username, password) {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.accountRepository.create(username, hashPassword);
    return user;
  }

  async findOne(username) {
    const user = await this.accountRepository.findOne(username);
    if (!user) {
      return { message: GeneralError.NotFound }
    }
    return user;
  }

  async login(user, password, expiresIn) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      return {message: GeneralError.WrongPassword};
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn});
    return {token: token, expires_in: expiresIn};
  }

  async findUserAndUpdate(filter, user, options) {
    const userUpdate = await this.accountRepository.findUserAndUpdate(filter, user, options);
    if (!userUpdate) {
      return {message: GeneralError.NotFound};
    }
    return userUpdate;
  }

  async compare(password, hashPassword) {
    const comparePassword = await bcrypt.compare(password, hashPassword);
    if (comparePassword) {
      return {message: GeneralError.SamePassword}
    }
    return comparePassword;
  }
}

module.exports = {AccountServices, };
