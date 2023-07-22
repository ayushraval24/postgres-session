// const { body } = require("express-validator");
import { body } from "express-validator";

export const signupValidationRules = [
  // Validate firstName
  body("firstName").notEmpty().withMessage("First name is required"),

  // Validate lastName
  body("lastName").notEmpty().withMessage("Last name is required"),

  // Validate email
  body("email").isEmail().withMessage("Invalid email address"),

  // Validate phone
  body("phone")
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Invalid phone number"),

  // Validate password
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 8 characters long"
    ),

  // Validate confirmPassword
  body("confirmPassword").custom((value: any, { req }: any) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

export const loginValidationRules = [
  // Validate email
  body("email").isEmail().withMessage("Invalid email address"),

  // Validate password
  body("password").notEmpty().withMessage("Password is required"),
];
