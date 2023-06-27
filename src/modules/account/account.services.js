import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import NodeMailer from 'nodemailer';
import { GeneralError, GeneralMessage } from '../../common/general';

export class AccountServices {
  constructor(configServices, accountRepository) {
    this.configServices = configServices;
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
    const token = jwt.sign({ id: user._id }, this.configServices.getJWTConfig().jwtSecret, { expiresIn });
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


export class UserTokenService {
  constructor(userTokenRepository, mailServices, configServices) {
    this.userTokenRepository = userTokenRepository;
    this.mailServices = mailServices;
    this.configServices = configServices;
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
    const secretKey = this.configServices.getJWTConfig().jwtSecret;
    const expiresIn = this.configServices.getJWTConfig().expiresIn;
    const payload = { userId, type: 'verification' };
    const userToken = jwt.sign(payload, secretKey, { expiresIn });
    return userToken;
  }

  async send_email(userToken, email) {
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

