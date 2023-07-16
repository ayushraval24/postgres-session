import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import { DefaultResponse } from "../helpers/defaultResponseHelper";

class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();
      return DefaultResponse(res, 200, "Users fetched successfully", users);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
