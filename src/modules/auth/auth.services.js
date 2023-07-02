import { GeneralError } from "../../common/general";
import { UserServices } from "../user/user.services";
import { bcryptServices } from "../../shared/bcrypt.services";
import { jwtServices } from "../../shared/jwt.services";
import { configServices } from "../../config";
import { mailServices } from "../../shared/mail.services";
import { alphabet } from "../../common/rand";
export class AuthServices {
  /**
  * @param {UserServices} userSevices 
  * @param {AuthSecret} authSecret 
  */
  constructor(userSevices, authSecret) {
    this.userSevices = userSevices;
    this.authSecret = authSecret;
  }

  async register(username, password, email) {
    const user = await this.userSevices.create(username, password, email);
    if (user) {
      const secret = await this.authSecret.create(user.id);
      const subject = 'Verification Token';
      const text = `Please use this token below to active your account:\n${secret.token}\n`;
      await mailServices.send(user.email, subject, text);
    }
    return user;
  }

  async login(username, password) {
    const user = await this.userSevices.findOne(username);
    const isPasswordValid = await bcryptServices.compare(password, user.password);
    if (!isPasswordValid) {
      throw GeneralError.WrongPassword;
    }
    const expiresIn = configServices.getJWTConfig().expiresIn;
    const token = jwtServices.encode({ id: user._id });
    return { token: token, expires_in: expiresIn };
  }

  async forgotPassword(email) {
    const user = await this.userSevices.findByEmail(email);
    const randPassword = alphabet();
    const subject = 'Reset Password';
    const text = `Please use this reset password below to login your account:\n${randPassword}\n`;
    await mailServices.send(email, subject, text);
    user.password = await bcryptServices.hashPassword(randPassword);
    await this.userSevices.update(user);
  }

  async changePassword(user, password) {
    const isCompare = await bcryptServices.compare(password, user.password);
    if (isCompare) {
      throw GeneralError.SamePassword;
    }
    user.password = await bcryptServices.hashPassword(password);
    await this.userSevices.update(user);
    return user;
  }
}