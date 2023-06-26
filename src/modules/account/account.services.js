require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GeneralError } = require("../../common/general");
const configServices = require("../../config");


class AccountServices {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async create(username, password, email) {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.accountRepository.create(username, hashPassword, email);
    if (!user) {
      return { message: GeneralError.VerifyAccountError }
    }
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
    if (!isPasswordValid) {
      return { message: GeneralError.WrongPassword };
    }
    const token = jwt.sign({ id: user._id }, configServices.getJWTConfig().jwtSecret, { expiresIn });
    return { token: token, expires_in: expiresIn };
  }

  async findUserAndUpdate(filter, user, options) {
    const userUpdate = await this.accountRepository.findUserAndUpdate(filter, user, options);
    if (!userUpdate) {
      return { message: GeneralError.NotFound };
    }
    return userUpdate;
  }

  async compare(password, hashPassword) {
    const comparePassword = await bcrypt.compare(password, hashPassword);
    if (comparePassword) {
      return { message: GeneralError.SamePassword }
    }
    return comparePassword;
  }
}


class UserTokenService {
  constructor(userTokenRepository, mailServices) {
    this.userTokenRepository = userTokenRepository;
    this.mailServices = mailServices;
  }

  async create(userId) {
    const token = await this.getToken(userId);
    const userToken = await this.userTokenRepository.create(userId, token);
    if (!userToken) {
      return { message: GeneralError.VerifyAccountError };
    }
    return userToken;
  }

  async getToken(userId) {
    const secretKey = configServices.getJWTConfig().jwtSecret;
    const expiresIn = configServices.getJWTConfig().expiresIn;
    const payload = { userId, type: 'verification' };
    const userToken = jwt.sign(payload, secretKey, { expiresIn });
    return userToken;
  }

  async sendEmail(userToken, email) {
    try {
      const subject = 'Verification Token';
      const text = `Please use this token below to active your account:\n${userToken}\n`;
      await this.mailServices.send(email, subject, text);
      return true;
    } catch {
      return false;
    }
  };
}

module.exports = { AccountServices, UserTokenService };
