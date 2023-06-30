import { GeneralError } from "../../common/general";
import { UserServices } from "../user/user.services";
import { bcryptServices } from "../../shared/bcrypt.services";
import { jwtServices } from "../../shared/jwt.services";
import { configServices } from "../../config";

export class AuthServices {
  /**
  * @param {UserServices} userSevices 
  * @param {AuthSecret} authSecret 
  * @param {MailServices} mailServices
  */
  constructor(userSevices, authSecret, mailServices) {
    this.userSevices = userSevices;
    this.authSecret = authSecret;
    this.mailServices = mailServices;
  }

  async register(username, password, email) {
    const user = await this.userSevices.create(username, password, email);
    if (user) {
      const secret = await this.authSecret.create(user.id);
      const subject = 'Verification Token';
      const text = `Please use this token below to active your account:\n${secret.token}\n`;
      await this.mailServices.send(user.email, subject, text);
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
}