import express from "express";
import { validate } from "../../shared/validate";
import { authController } from "./auth.controller";
import { protect } from "./auth.middleware";
import { loginSchema, registerSchema } from "./auth.validation";

const router = express.Router();

router.post("/register", protect, validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", protect, authController.logout);

export const authRouter = router;
