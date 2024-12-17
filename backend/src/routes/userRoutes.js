import {Router} from "express";
import { registerUser , loginUser , logoutUser, fetchUser } from "../controllers/userControl.js";
const router = Router();
router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser)
router.route("/logoutUser").post(logoutUser)
router.route("/fetchUser").post(fetchUser)
export default router