import { bcryptServices } from '../../shared/bcrypt.services.js';
import { jwtServices } from '../../shared/jwt.services.js';
import { GeneralError } from '../../common/general.js';
import { AccountRepository } from './auth.repository.js';

export class AccountServices {
  /**
   * @param {AccountRepository} accountRepository 
   */
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async create(username, password, email) {
    const hashPassword = await bcryptServices.hashPassword(password);
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
    const isPasswordValid = await bcryptServices.compare(password, user.password);
    if (!isPasswordValid) {
      return { message: GeneralError.WrongPassword };
    }
    const token = jwtServices.encode({ id: user._id });
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
  constructor(userTokenRepository, mailServices) {
    this.userTokenRepository = userTokenRepository;
    this.mailServices = mailServices;
  }

  async create(userId) {
    const payload = {
      userId, type: 'verification'
    };
    const token = jwtServices.encode(payload);
    const userToken = await this.userTokenRepository.create(userId, token);
    if (!userToken) {
      return { message: GeneralError.VerifyAccountError };
    }
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

