import { Router } from "express";

import { chooseMess } from "../controllers/mess/choose.controller.js";

const router = Router();

router.route("/choose-mess/:userId").post(chooseMess);

export default router;
