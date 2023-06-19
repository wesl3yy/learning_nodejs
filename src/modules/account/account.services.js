require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const error = require("../../common/general");

class AccountServices {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async create(username, password, type) {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.accountRepository.create(username, hashPassword, type);
    return user;
  }

  async findUserByName(userId, username) {
    const user = await this.accountRepository.findUserByName(userId, username);
    if(!user) {
      return {message: error.NotFound};
    }
    return user;
  }

  async findUserAndType(username, type) {
    const user = await this.accountRepository.findUserAndType(username, type);
    if (!user){
      return {message: error.NotFound};
    }
    return user;
  }

  async login(user, password, expiresIn) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      return {message: error.WrongPassword};
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn});
    return {token: token, expires_in: expiresIn};
  }

  async findUserAndUpdate(user, filter, options) {
    const userUpdate = await this.accountRepository.findUserAndUpdate(user, filter, options);
    if (!userUpdate) {
      return {message: error.NotFound};
    }
    return userUpdate;
  }
}

class AccountTypeServices {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async findType(type) {
    const accType = await this.accountRepository.findType(type);
    if (!accType) {
      return {message: error.NotFoundType};
    }
    return accType;
  }
}

module.exports = {AccountServices, AccountTypeServices};
