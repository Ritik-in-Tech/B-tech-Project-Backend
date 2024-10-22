import { Router } from "express";

import { chooseMess } from "../controllers/mess/choose.controller.js";
import { EntryDataMess } from "../controllers/mess/entry.mess.controller.js";
import { verifyJwt } from "../middlewares/auth_middleware.js";
import { GetMessData } from "../controllers/mess/get_mess_data.controller.js";

const router = Router();

router.use(verifyJwt);

router.route("/choose-mess").post(chooseMess);

router.route("/entry-mess").post(EntryDataMess);

router.route("/get-mess-data/:messName").get(GetMessData);

export default router;
