import express from "express";
import { authController } from "../controllers";
import {
  loginValidationRules,
  signupValidationRules,
} from "../helpers/validators";
const router = express.Router();

router.post("/register", signupValidationRules, authController.register);
router.post("/login", loginValidationRules, authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);

export default router;
