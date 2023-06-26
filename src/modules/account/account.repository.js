class AccountRepository {
  constructor(user) {
    this.user = user;
  }

  async create(username, password) {
    const userModel = new this.user({
      username: username,
      password,
    })
    const doc = await userModel.save();
    return doc;
  }

  async findOne(username){
    const user = await this.user.findOne({ username: username });
    return user
  }

  async findUserAndUpdate(filter, user, options) {
    const updateUser = await this.user.findOneAndUpdate(filter, user, options);
    return updateUser; 
  };

}

module.exports = {AccountRepository,};
