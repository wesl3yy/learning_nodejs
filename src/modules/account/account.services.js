require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GeneralError, GeneralMessage } = require("../../common/general");
const ConfigServices = require("../../config");
const NodeMailer = require("nodemailer");
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
    if(!isPasswordValid) {
      return {message: GeneralError.WrongPassword};
    }
    const token = jwt.sign({id: user._id}, ConfigServices.getJWTConfig().jwtSecret, {expiresIn});
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


class UserTokenService {
  constructor(userTokenRepository) {
    this.userTokenRepository = userTokenRepository;
  }

  async create(userId) {
    const token = await this.get_token(userId);
    const userToken = await this.userTokenRepository.create(userId, token);
    if (!userToken) {
      return { message: GeneralError.VerifyAccountError };
    }
    return userToken;
  }

  async get_token(userId) {
    const secretKey = ConfigServices.getJWTConfig().jwtSecret;
    const expiresIn = ConfigServices.getJWTConfig().expiresIn;
    const payload = { userId, type: 'verification' };
    const userToken = jwt.sign(payload, secretKey, { expiresIn });
    return userToken;
  }

  async send_email(userToken, email) {
    const emailService = ConfigServices.getEmailService();
    const emailAuth = ConfigServices.getEmailAuth();
    const transporter = NodeMailer.createTransport({
      service: emailService,
      auth: emailAuth
    });
    const mailOptions = {
      from: configServices.getEmailAuth().user,
      to: email,
      subject: 'Verification Token',
      text: `Please use this token below to active your account:\n${userToken}\n`,
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return { message: GeneralError.EmailSentError}
      } else {
        return { message: GeneralMessage.EmailSent }
      }
    }
  )};
}

module.exports = {AccountServices, UserTokenService};
