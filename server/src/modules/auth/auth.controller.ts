import { RequestHandler } from "express";
import { authService } from "./auth.service";

class AuthController {
  register: RequestHandler = async (req, res, next) => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ success: true, message: "Foydalanuvchi yaratildi", data: user });
    } catch (error) {
      next(error);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    try {
      const { user, token } = await authService.login(req.body);
      res.status(200).json({ success: true, message: "Tizimga kirildi", data: { user, token } });
    } catch (error) {
      next(error);
    }
  };

  logout: RequestHandler = (_req, res) => {
    res.status(200).json({ success: true, message: "Tizimdan chiqildi", data: null });
  };
}

export const authController = new AuthController();
