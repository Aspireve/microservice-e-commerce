import { asyncHandler } from "../middleware/async";
import { createError } from "../utils/createError";
import { Category } from "../models/Category";

export const getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).send({ status: "success", data: res.advanceResults });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.categoryId);

  if (!category)
    throw createError(
      404,
      `Category is not found with id of ${req.params.categoryId}`
    );

  res.status(200).send({ status: "success", data: category });
});

export const addCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).send({ status: "success", data: category });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const editCategory = await Category.findByIdAndUpdate(
    req.params.categoryId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editCategory)
    throw createError(
      404,
      `Category is not found with id of ${req.params.categoryId}`
    );

  const updatedUser = await Category.findById(req.params.categoryId);

  res.status(201).send({ status: "success", data: updatedUser });
});

export const removeCategory = asyncHandler(async (req, res, next) => {
  const findCategory = await Category.findByIdAndDelete(req.params.categoryId);

  if (!findCategory)
    throw createError(
      404,
      `Category is not found with id of ${req.params.categoryId}`
    );

  res
    .status(204)
    .send({ status: "success", message: "Category Deleted Successfully" });
});