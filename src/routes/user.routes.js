import { Router } from "express";
import { registerUser } from "../controllers/users/create.controller.js";

const router = Router();

router.route("/").post(registerUser);

export default router;
