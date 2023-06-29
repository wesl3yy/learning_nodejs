import { jwtServices } from "../../shared/jwt.services";

export class AuthSecret {
  constructor(userSecret) {
    this.userSecret = userSecret;
  }

  async create(userId) {
    try {
      const payload = {
        userId, type: 'verification'
      }
      const token = jwtServices.encode(payload);
      const userTokenModel = new this.userSecret({
        token: token,
        user_id: userId
      })
      const doc = await userTokenModel.save();
      return doc;
    } catch (e) {
      throw e;
    }
  }
}