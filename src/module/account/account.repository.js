class AccountRepository {
  constructor(user) {
    this.user = user;
  }

  async create(username, password, type) {
    const userModel = new this.user({
      username: username,
      password,
      type_id: type,
    })
    const doc = await userModel.save();
    return doc;
  }

  async findUserByName(userId, username) {
    const user = this.user.findOne({_id: userId, username: username}, {password: 0});
    return user;
  }

  async findUserAndType(username, type) {
    const userModel = await this.user.findOne({username, type_id: type});
    return userModel;
  };

  async findUserAndUpdate(user, filter, options) {
    const updateUser = await this.user.findOneAndUpdate(filter, user, options);
    return updateUser; 
  };
}

class AccountTypeRepository {
  constructor(accountType) {
    this.accountType = accountType;
  }

  async findType(type) {
    const accType = await this.accountType.findOne({code: type});
    return accType;
  }
}

module.exports = {AccountRepository, AccountTypeRepository};
