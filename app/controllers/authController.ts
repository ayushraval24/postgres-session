import { Request, Response, NextFunction } from "express";
import { checkValidation } from "../helpers/validationHelper";
import { validationResult } from "express-validator";
import { authService } from "../services";
import {
  CookieResponse,
  DefaultResponse,
} from "../helpers/defaultResponseHelper";
import { RequestExtended } from "../types/global";
import {
  generateAccessToken,
  verifyRefreshToken,
} from "../helpers/tokenHelper";
import { CustomError } from "../models/CustomError";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      checkValidation(req);

      const { firstName, lastName, email, phone, password } = req.body;

      const user = await authService.register(
        firstName,
        lastName,
        email.toLowerCase(),
        phone,
        password
      );

      return DefaultResponse(res, 200, "User registration successful", user);
    } catch (err) {
      next(err);
    }
  }

  async login(req: RequestExtended, res: Response, next: NextFunction) {
    try {
      checkValidation(req);

      const { email, password } = req.body;

      const { data, accessToken, refreshToken } = await authService.login(
        email,
        password
      );

      req.session.accessToken = accessToken;
      req.session.refreshToken = refreshToken;

      return DefaultResponse(res, 200, "Login successful", {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: data,
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: RequestExtended, res: Response, next: NextFunction) {
    try {
      // Get the refresh token from the cookies
      const refreshToken = req.session.refreshToken;

      // Verify the refresh token
      const verified: any = verifyRefreshToken(refreshToken);

      if (!verified) {
        const error = new CustomError(401, "Invalid refresh token");
        return next(error);
      }

      // Generate a new access token
      const accessToken = generateAccessToken({
        id: verified?.id,
        email: verified?.email,
      });

      // Update the access token in the session
      req.session.accessToken = accessToken;

      // Return the new access token in the response
      return DefaultResponse(
        res,
        200,
        "Token updated successfully",
        accessToken
      );
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Internal server error" });
        }
        // res.clearCookie("refreshToken"); // Remove the refresh token cookie
        return DefaultResponse(res, 200, "Logout Successful");
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
