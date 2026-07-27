import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../shared/prisma";
import { ApiError } from "../../shared/ApiError";
import { JWT_EXPIRES_IN, JWT_SECRET, SALT_ROUNDS } from "../../shared/constants";
import { LoginInput, RegisterInput } from "./auth.validation";

const publicFields = { id: true, username: true, createdAt: true } as const;

class AuthService {
  async register({ username, password }: RegisterInput) {
    const exists = await prisma.user.findUnique({ where: { username } });
    if (exists) {
      throw new ApiError(409, "Bunday username allaqachon mavjud");
    }

    return prisma.user.create({
      data: { username, password: await bcrypt.hash(password, SALT_ROUNDS) },
      select: publicFields,
    });
  }

  async login({ username, password }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ApiError(401, "Username yoki parol noto'g'ri");
    }

    return {
      user: { id: user.id, username: user.username, createdAt: user.createdAt },
      token: this.signToken(user.id),
    };
  }

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: publicFields });
  }

  private signToken(userId: string) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}

export const authService = new AuthService();
