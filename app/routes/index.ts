import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import { customError, notFound } from "../helpers/errorHandler";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", isAuthenticated, userRoutes);

// Error Handler
router.use(notFound);
router.use(customError);

export default router;
