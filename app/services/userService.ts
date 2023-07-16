import { userRepository } from "../repositories";

class AuthService {
  async getAllUsers() {
    try {
      const users = await userRepository.getAll();
      return users;
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
