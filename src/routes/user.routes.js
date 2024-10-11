import { Router } from "express";
import { registerUser } from "../controllers/users/create_controller.js";
import { loginUser } from "../controllers/users/login_controller.js";
import { getAllUsers, getUser } from "../controllers/users/get_controller.js";
import { getAnsiKey } from "../controllers/users/getAnsiKey_controller.js";
import { addAnsiKey } from "../controllers/users/addansikey_controller.js";
import { verifyJwt } from "../middlewares/auth_middleware.js";

const router = Router();

router.route("/").post(registerUser);

router.route("/login").post(loginUser);

router.route("/:rollNumber").get(getUser);

router.route("/get-ansiKey/:userId").get(getAnsiKey);

router.use(verifyJwt);

router.route("/").get(getAllUsers);

router.route("/add-ansiKey/:userId").post(addAnsiKey);
export default router;
