export class AccountRepository {
  constructor(user) {
    this.user = user;
  }

  async create(username, password, email) {
    const userModel = new this.user({
      username: username,
      password: password,
      email: email
    })
    const doc = await userModel.save();
    return doc
  }

  async findOne(username) {
    const user = await this.user.findOne({ username: username });
    return user
  }

  async findUserAndUpdate(filter, user, options) {
    const updateUser = await this.user.findOneAndUpdate(filter, user, options);
    return updateUser;
  };

}

export class UserTokenRepository {
  constructor(userToken) {
    this.userToken = userToken;
  }

  async create(userId, token) {
    const userTokenModel = new this.userToken({
      token: token,
      user_id: userId
    })
    const doc = await userTokenModel.save();
    return doc;
  }
}


