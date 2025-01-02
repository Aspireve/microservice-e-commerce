import * as C from "../controller/auth";
import { protect } from "../middleware/auth";

const router = require("express").Router();

router.route("/login").post(C.login);
router.route("/register").post(C.RegisterUser);
router.route("/verify-email").post(C.verificationEmail);
router.route("/update/userDetails").put(protect, C.updateDetails);
router.route("/update/password").put(protect, C.updatePassword);
router.route("/forgot-password").post(C.forgotPassword);
router.route("/reset-password").post(C.resetPassword);

export default router;
