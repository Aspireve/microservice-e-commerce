import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "Please add a category name"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Category = mongoose.model("Category", CategorySchema);
