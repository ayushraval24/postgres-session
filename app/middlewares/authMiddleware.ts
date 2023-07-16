import { Request, Response, NextFunction } from "express";
import { DefaultResponse } from "../helpers/defaultResponseHelper";
import { CustomError } from "../models/CustomError";
import { verifyAccessToken, verifyRefreshToken } from "../helpers/tokenHelper";
import { RequestExtended } from "../types/global";

export const isAuthenticated = (
  req: RequestExtended,
  res: Response,
  next: NextFunction
) => {
  // Get the access token from the Authorization header
  const accessToken = req.headers.authorization?.split(" ")[1];

  // Get the refresh token from the cookies
  const refreshToken = req.session.refreshToken;

  // Check if access token and refresh token are present
  if (!accessToken || !refreshToken) {
    const error = new CustomError(401, "Unauthorized");
    return next(error);
  }

  // Verify the access token
  if (!verifyAccessToken(accessToken!)) {
    const error = new CustomError(401, "Invalid access token");
    return next(error);
  }

  // Verify the refresh token
  if (!verifyRefreshToken(refreshToken!)) {
    const error = new CustomError(401, "Invalid refresh token");
    return next(error);
  }

  // Tokens are valid, proceed to the next middleware or route
  next();
};
