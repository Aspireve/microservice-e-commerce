import * as C from "../controller/review";
import advanceResults from "../middleware/advanceResults";
import { protect } from "../middleware/auth";
import { Review } from "../models/Review";

const router = require("express").Router({ mergeParams: true });

router
  .route("/")
  .get(
    advanceResults(Review, {
      path: "productId",
      select: "name brand",
    }),
    C.getReviews
  )
  .post(protect, C.createReview);

router
  .route("/:id")
  .get(C.getReview)
  .put(protect, C.updateReview)
  .delete(protect, C.deleteReview);
router.route("/update-rating/:id").put(protect, C.updateRating);

export default router;
