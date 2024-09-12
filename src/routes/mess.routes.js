import { Router } from "express";

import { chooseMess } from "../controllers/mess/choose.controller.js";
import { EntryDataMess } from "../controllers/mess/entry.mess.controller.js";

const router = Router();

router.route("/choose-mess/:userId").post(chooseMess);

router.route("/entry-mess").post(EntryDataMess);

export default router;
