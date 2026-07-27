import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../../shared/ApiError";
import { JWT_SECRET } from "../../shared/constants";
import { authService } from "./auth.service";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; username: string };
    }
  }
}

export const protect: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new ApiError(401, "Token yuborilmadi");
    }

    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(header.slice(7), JWT_SECRET) as jwt.JwtPayload;
    } catch {
      throw new ApiError(401, "Token yaroqsiz yoki muddati tugagan");
    }

    const user = await authService.findById(String(payload.sub));
    if (!user) {
      throw new ApiError(401, "Foydalanuvchi topilmadi");
    }

    req.user = { id: user.id, username: user.username };
    next();
  } catch (error) {
    next(error);
  }
};
