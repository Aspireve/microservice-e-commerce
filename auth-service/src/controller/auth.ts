import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import { asyncHandler } from "../middleware/async";
import { User, IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

// Helper function for sending token response
const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  res: Response
): void => {
  const token = user.genAuthToken();

  const userData = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verify: user.verify,
  };

  res.status(statusCode).send({ status: "success", token, authData: userData });
};

// Register User
export const RegisterUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let uid = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (let i = 0; i < 6; i++) {
      uid += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    uid = "123456"; // Debug: Hardcoded for now

    const newUser = await User.create({ ...req.body, uid });

    try {
      setTimeout(async () => {
        const user1 = await User.findOne({ email: newUser.email });
        if (user1 && !user1.verify) {
          await User.findOneAndDelete({ email: user1.email });
          console.log(
            `Unverified user with email ${user1.email} has been deleted.`
          );
        }
      }, 59 * 60 * 1000); // 59 minutes

      res.status(200).send({
        status: "success",
        message: "Verification Code sent to your email.",
      });
    } catch (error) {
      throw createError(500, "Verification email couldn't be sent");
    }
  }
);

// Login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: IUser = await User.findOne({
      email: req.body.email,
      verify: true,
    }).select("+password");

    if (!user) throw createError(401, "Email doesn't match");

    const isPassword = await user.matchPassword(req.body.password);
    if (!isPassword) throw createError(401, "Password doesn't match");

    sendTokenResponse(user, 200, res);
  }
);

// Verification Email
export const verificationEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: IUser | null = await User.findOne({
      uid: req.body.verificationCode,
    });

    if (!user) throw createError(401, "Invalid verification code");

    if (user.verify)
      throw createError(401, "You have already verified. Login to continue.");

    user.verify = true;

    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  }
);

// Update User Details
export const updateDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newDetails = {
      name: req.body.name,
      email: req.body.email,
    };

    const updatedUser = await User.findByIdAndUpdate(req.user._id, newDetails, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) throw createError(404, "User not found");

    res.status(200).send({ status: "success", data: updatedUser });
  }
);

// Update Password
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: IUser = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) throw createError(400, "Current password doesn't match");

    user.password = req.body.newPassword;

    await user.save();

    sendTokenResponse(user, 200, res);
  }
);

// Forgot Password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      throw createError(400, `User with email ${req.body.email} is not found`);

    try {
      res
        .status(200)
        .send({ status: "success", message: "Reset password email sent" });
    } catch (error) {
      console.error(error);
      throw createError(500, "Email couldn't be sent");
    }
  }
);

// Reset Password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) throw createError(400, "Invalid token");

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).send({
      status: "success",
      message: "Your password has been changed",
    });
  }
);
