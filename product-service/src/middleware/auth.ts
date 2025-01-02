import { createError } from "../utils/createError";
import { verifyToken } from "../utils/jwt";
import { asyncHandler } from "./async";
import { IUser, User } from "../models/User";
import { JWT_SECRET } from "../constants";
import { Request, Response, NextFunction } from "express";

interface DecodedToken {
  _id: string;
}

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization || !authorization.toLowerCase().startsWith("bearer")) {
    throw createError(401, "Not authorized");
  }

  const token = authorization.split(" ")[1];

  let decodedToken: DecodedToken;
  try {
    decodedToken = verifyToken(token, JWT_SECRET!) as DecodedToken;
  } catch (error) {
    throw createError(401, "Invalid token");
  }

  const user: IUser | null = await User.findById(decodedToken._id);
  if (!user) {
    throw createError(401, "User not found");
  }

  req.user = user; // Attach the user object to the request

  next();
});

export const permission =
  (role: string) => (req: Request, res: Response, next: NextFunction) => {
    if (role !== req.user.role)
      throw createError(
        401,
        `User role ${req.user.role} is not allowed to access this resource`
      );

    next();
  };
