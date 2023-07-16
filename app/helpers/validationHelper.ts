const { validationResult } = require("express-validator");
import { Request, NextFunction } from "express";

export const checkValidation = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationError = {
      status: 400,
      //   status: 422,
      message: errors.errors[0].msg,
    };
    throw validationError;
  }
};
