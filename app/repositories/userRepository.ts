import { PrismaClient } from "@prisma/client";
import { UserData } from "../types";

const prisma = new PrismaClient();

class AuthRepository {
  async getAll() {
    // try {
    const users = await prisma.user.findMany();
    return users;
    // } catch (err) {
    //   throw err;
    // }
  }

  async getById(id: string) {
    // try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
    // } catch (err) {
    //   throw err;
    // }
  }

  async getByEmail(email: string) {
    // try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
    // } catch (err) {
    //   throw err;
    // }
  }

  async create(data: UserData) {
    // try {
    const user = await prisma.user.create({
      data: data,
    });
    return user;
    // } catch (err) {
    //   throw err;
    // }
  }
}

export default new AuthRepository();
