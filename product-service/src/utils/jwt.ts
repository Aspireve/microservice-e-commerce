import jwt from "jsonwebtoken"
import { createError } from "./createError";

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof Error) {
      if (error?.name === "TokenExpiredError")
        throw createError(401, "Token is expired. Please Login");
    }

    throw error;
  }
};
