import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} .env faylida aniqlanmagan`);
  }
  return value;
}

export const PORT = process.env.PORT || 4000;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
export const DATABASE_URL = required("DATABASE_URL");
export const JWT_SECRET = required("JWT_SECRET");
export const JWT_EXPIRES_IN = "1h";
export const SALT_ROUNDS = 10;
