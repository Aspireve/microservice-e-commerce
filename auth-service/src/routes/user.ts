import * as C from "../controller/user";
import advanceResults from "../middleware/advanceResults";
import { protect, permission } from "../middleware/auth";
import { User } from "../models/User";

const router = require("express").Router();

router.use(protect);
router.use(permission("admin"));

router.route("/").get(advanceResults(User), C.getUsers).post(C.createUser);

router.route("/:id").get(C.getUser).put(C.updateUser).delete(C.deleteUser);

export default router;
