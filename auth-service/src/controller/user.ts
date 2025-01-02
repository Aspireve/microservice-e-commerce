import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/createError";
import { asyncHandler } from "../middleware/async";
import { User, IUser } from "../models/User";
// const asyncHandler = require("../middleware/async");
// const createError = require("../utilis/createError");
// const User = require("../models/User");

export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).send({ status: "success", data: res.advanceResults });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    throw createError(404, `User is not found with id of ${req.params.id}`);

  res.status(200).send({ status: "success", data: user });
});

export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).send({ status: "success", data: user });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const editUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!editUser)
    throw createError(404, `User is not found with id of ${req.params.id}`);

  const updatedUser = await User.findById(req.params.id);

  res.status(201).send({ status: "success", data: updatedUser });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const deleteUser = await User.findById(req.params.id);

  if (!deleteUser)
    throw createError(404, `User is not found with id of ${req.params.id}`);

  await deleteUser.deleteOne();
  res
    .status(204)
    .send({ status: "success", message: "User Deleted Successfully" });
});