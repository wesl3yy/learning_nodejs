const bcrypt = require('bcrypt');

class AccountServices {
  constructor(accountRepository) {
    this.accountRepository = accountRepository;
  }

  async create(username, password) {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await this.accountRepository.create(username, hashPassword);
    return user;
  }
}

module.exports = AccountServices;