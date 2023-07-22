import { NextFunction, Response } from "express";
import {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../helpers/tokenHelper";
import { CustomError } from "../models/CustomError";
import { RequestExtended } from "../types/global";

export const refreshAccessToken = async (refreshToken: string) => {
  // try {
  const verified: any = verifyRefreshToken(refreshToken);

  console.log("Verified refresh: ", verified);
  if (!verified) {
    const error = new CustomError(401, "Invalid refresh token");
    throw error;
  }
  const token = generateAccessToken({
    id: verified?.id,
    email: verified?.email,
  });
  return token;
  // } catch (err) {
  //   throw err;
  // }
};

export const isAuthenticated = (
  req: RequestExtended,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get the access token from the Authorization header
    // const accessToken = req.headers.authorization?.split(" ")[1];

    console.log("REQ: ", req.session);
    console.log("REQ cookie: ", req.cookies);

    // Get the refresh token from the session
    const accessToken = req.session.accessToken;

    // Get the refresh token from the session
    const refreshToken = req.session.refreshToken;

    // Check if access token and refresh token are present
    if (!accessToken || !refreshToken) {
      const error = new CustomError(
        401,
        "Your session has expired, please login again"
      );
      return next(error);
    }

    // Verify the access token

    const verifiedAccessToken = verifyAccessToken(accessToken);

    if (!verifiedAccessToken) {
      const error = new CustomError(401, "Invalid access token");
      return next(error);
    }

    // // Verify the refresh token
    // if (!verifyRefreshToken(refreshToken!)) {
    //   const error = new CustomError(401, "Invalid refresh token");
    //   return next(error);
    // }

    // Tokens are valid, proceed to the next middleware or route
    next();
  } catch (err: any) {
    if (err.name == "TokenExpiredError") {
      refreshAccessToken(req.session.refreshToken)
        .then((newToken: string) => {
          console.log("New token: " + newToken);
          req.session.accessToken = newToken;
          next();
        })
        .catch((err) => {
          next(err);
        });
    } else {
      next(err);
    }
  }
};
