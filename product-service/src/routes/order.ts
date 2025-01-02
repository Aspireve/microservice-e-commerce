import * as C from "../controller/order";
import advanceResults from "../middleware/advanceResults";
import { protect, permission } from "../middleware/auth";
import { Order } from "../models/Order";

const router = require("express").Router();

router.use(protect);

router
  .route("/")
  .get(
    permission("admin"),
    advanceResults(Order, {
      path: "userId",
      select: "name email",
    }),
    C.getOrders
  )
  .post(C.createOrder);
router.route("/auth-orders").get(C.authOrder);

router
  .route("/:orderId")
  .get(C.getOrder)
  .put(C.updateOrder)
  .delete(C.deleteOrder);

router.route("/:orderId/pay").post(C.payment);
router.route("/:orderId/deliver").post(C.deliverOrder);

export default router;
