import * as C from "../controller/product";
import advanceResults from "../middleware/advanceResults";
import { protect, permission } from "../middleware/auth";
import { Product } from "../models/Product";

const router = require("express").Router();

router
  .route("/")
  .get(
    advanceResults(Product, {
      path: "Reviews",
      select: "title",
    }),
    C.getProducts
  )
  .post(protect, permission("admin"), C.createProduct);

router
  .route("/:productId")
  .get(C.getProduct)
  .put(protect, permission("admin"), C.updateProduct)
  .delete(protect, permission("admin"), C.deleteProduct);

export default router;
