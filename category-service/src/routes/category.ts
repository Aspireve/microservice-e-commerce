import * as C from "../controller/category";
import { Category } from "../models/Category";
import { protect, permission } from "../middleware/auth";
import advanceResults from "../middleware/advanceResults";

const router = require("express").Router();

router
  .route("/")
  .get(advanceResults(Category), C.getCategories)
  .post(protect, permission("admin"), C.addCategory);

router
  .route("/:categoryId")
  .get(C.getCategory)
  .put(protect, permission("admin"), C.updateCategory)
  .delete(protect, permission("admin"), C.removeCategory);

export default router;
