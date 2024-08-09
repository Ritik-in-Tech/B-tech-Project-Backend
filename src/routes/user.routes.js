import { Router } from "express";
import { registerUser } from "../controllers/users/create.controller.js";
import { loginUser } from "../controllers/users/login.controller.js";

const router = Router();

router.route("/").post(registerUser);

router.route("/login").post(loginUser);

export default router;
