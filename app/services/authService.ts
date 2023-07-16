import { comparePassword, hashPassword } from "../helpers/passwordHelper";
import { CustomError } from "../models/CustomError";
import { userRepository } from "../repositories";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../helpers/tokenHelper";

class AuthService {
  async register(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) {
    try {
      // Check if the user already registered
      const user = await userRepository.getByEmail(email);

      // User is already registered
      if (user) {
        const error = new CustomError(400, "User already registered");
        throw error;
      }

      //   Encrypt the password
      const hashedPassword = await hashPassword(password);

      //   Create a new User
      const newUser = await userRepository.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        password: hashedPassword,
      });

      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async login(email: string, password: string) {
    try {
      // Check if the user already exists

      const user = await userRepository.getByEmail(email);

      //   User not found
      if (!user) {
        const error = new CustomError(401, "Invalid credentials");
        throw error;
      }

      //   Validate Password
      const validPassword = await comparePassword(password, user.password!);

      console.log("Valid Password", validPassword, password, user.password);

      //   Password not valid
      if (!validPassword) {
        const error = new CustomError(401, "Invalid credentials");
        throw error;
      }

      //   Credentials Valid
      const accessToken = generateAccessToken({ id: user?.id, email: email });
      const refreshToken = generateRefreshToken({ id: user?.id, email: email });

      const data = {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phone: user?.phone,
      };

      return { data, accessToken, refreshToken };
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
