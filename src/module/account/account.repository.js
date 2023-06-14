class AccountRepository {
  constructor(user) {
    this.user = user;
  }

  async create(username, password) {
    const userModel = new this.user({
      username: username,
      password,
      // fake type_id
      type_id: '123',
    })
    const doc = await userModel.save();
    return doc;
  }
}

module.exports = AccountRepository;