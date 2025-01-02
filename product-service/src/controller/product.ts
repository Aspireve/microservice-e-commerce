import { asyncHandler } from "../middleware/async";
import { createError } from "../utils/createError";
import { Product } from "../models/Product";
import path from "path";

export const getProducts = asyncHandler(async (req, res, next) => {
  const keyWord = req.query.keyWord;
  if (keyWord) {
    const searchItem = keyWord
      ? { name: { $regex: keyWord, $options: "i" } }
      : {};

    const searchProduct = await Product.find(searchItem);

    res.status(200).send({
      status: "success",

      data: { results: searchProduct, count: searchProduct.length },
    });
  } else {
    res.status(200).send({ status: "success", data: res.advanceResults });
  }
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate({
    path: "Reviews",
    select: "title text",
  });

  if (!product)
    throw createError(
      404,
      `Product is not found with id of ${req.params.productId}`
    );

  res.status(200).send({ status: "success", data: product });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  if (!req.body.productImage) throw createError(400, "Please add a photo");

  const file = req.body.productImage;
  if (!file.startsWith("data:image"))
    throw createError(400, "This file is not supported");

  const product = await Product.create({
    ...req.body,
  });
  res.status(200).send({ status: "success", data: product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const editProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!editProduct)
    throw createError(
      404,
      `Product is not found with id of ${req.params.productId}`
    );

  const updatedProduct = await Product.findById(req.params.productId);

  res.status(201).send({ status: "success", data: updatedProduct });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const deleteProduct = await Product.findById(req.params.productId);

  if (!deleteProduct)
    throw createError(
      404,
      `User is not found with id of ${req.params.productId}`
    );

  await deleteProduct.deleteOne();

  res
    .status(204)
    .send({ status: "success", message: "Product Deleted Successfully" });
});
