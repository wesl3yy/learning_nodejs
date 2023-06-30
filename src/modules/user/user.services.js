import { GeneralError } from "../../common/general";
import { UserRepository } from "./user.repository";
import { bcryptServices } from "../../shared/bcrypt.services";

export class UserServices {
  /**
   * @param {UserRepository} userRepository 
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async create(username, password, email) {
    const hashPassword = await bcryptServices.hashPassword(password);
    const user = await this.userRepository.create(username, hashPassword, email);
    return user;
  }

  async findOne(username) {
    const user = await this.userRepository.findOne(username);
    if (!user) {
      throw GeneralError.NotFound;
    }
    return user;
  }

  async findById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw GeneralError.NotFound;
    }
    return user;
  }

  async findUserAndUpdate(filter, user, options) {
    const userUpdate = await this.userRepository.findUserAndUpdate(filter, user, options);
    return userUpdate;
  }
}