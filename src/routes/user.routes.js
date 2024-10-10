import { Router } from "express";
import { registerUser } from "../controllers/users/create.controller.js";
import { loginUser } from "../controllers/users/login.controller.js";
import { getAllUsers, getUser } from "../controllers/users/get.controller.js";
import { getAnsiKey } from "../controllers/users/getAnsiKey.js";

const router = Router();

router.route("/").post(registerUser);

router.route("/login").post(loginUser);

router.route("/").get(getAllUsers);

router.route("/:rollNumber").get(getUser);

router.route("/get-ansiKey/:rollNumber").get(getAnsiKey);
export default router;
