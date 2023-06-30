import { GeneralError } from "../../common/general";
import { MongoErrorCodes } from "../../database/db";

export class UserRepository {
  constructor(user) {
    this.user = user;
  }

  async create(username, password, email) {
    try {
      const userModel = new this.user({
        username: username,
        password: password,
        email: email
      })
      const doc = await userModel.save();
      return doc;
    } catch (e) {
      if (e.code === MongoErrorCodes.Duplicate) {
        throw GeneralError.UserExisted;
      } else {
        throw e;
      }
    }
  }

  async findOne(username) {
    const user = await this.user.findOne({ username: username });
    return user
  }

  async findById(id) {
    const user = await this.user.findOne({ _id: id });
    return user
  }

  async findUserAndUpdate(filter, user, options) {
    try {
      const updateUser = await this.user.findOneAndUpdate(filter, user, options);
      return updateUser;
    } catch (e) {
      if (e.code === MongoErrorCodes.Duplicate) {
        throw GeneralError.UserExisted;
      } else {
        throw e;
      }
    }
  };
}