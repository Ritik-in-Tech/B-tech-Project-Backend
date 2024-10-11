import { Router } from "express";

import { chooseMess } from "../controllers/mess/choose.controller.js";
import { EntryDataMess } from "../controllers/mess/entry.mess.controller.js";
import { verifyJwt } from "../middlewares/auth_middleware.js";

const router = Router();

router.use(verifyJwt);

router.route("/choose-mess").post(chooseMess);

router.route("/entry-mess").post(EntryDataMess);

export default router;
