import crypto from "crypto";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_EXPIREIN, JWT_SECRET } from "../constants";
import { Review } from "./Review";
import { Order } from "./Order";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  uid: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
    unique: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    minlength: [8, "Password should be 8 character long"],
    required: [true, "Please add a password"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this._id;
    await mongoose.model("Review", Review.schema).deleteMany({ userId });
    await mongoose.model("Order", Order.schema).deleteMany({ userId });
    next();
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const SaltFactor = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, SaltFactor);

  next();
});

UserSchema.methods.genAuthToken = function () {
  return jwt.sign({ _id: this._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIREIN,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //hash the resetToken and set it to this.resetPasswordToken

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// User interface definition
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  uid: string;
  email: string;
  verify: boolean;
  password: string;
  role: string;
  resetPasswordToken: string;
  resetPasswordExpire: string;
  createdAt: Date;
  genAuthToken(): string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

export const User = mongoose.model("User", UserSchema);
