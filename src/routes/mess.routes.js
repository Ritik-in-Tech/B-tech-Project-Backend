import { Router } from "express";

import { chooseMess } from "../controllers/mess/choose.controller.js";
import { EntryDataMess } from "../controllers/mess/entry.mess.controller.js";
import { verifyJwt } from "../middlewares/auth_middleware.js";
// import { GetMessData } from "../controllers/mess/get_mess_data.controller.js";
import { entryMessQR } from "../controllers/mess/entry_mess_qr.controller.js";
import { GetOverallMessData } from "../controllers/mess/data/overall_data.controller.js";
import { getMessDataByDate } from "../controllers/mess/data/data_by_date.controller.js";
import { getDataByRollNumber } from "../controllers/mess/data/data_by_rollNumber.controller.js";

const router = Router();

router.use(verifyJwt);

router.route("/choose-mess").post(chooseMess);

router.route("/entry-mess").post(EntryDataMess);

router.route("/get-mess-data/:messName").get(GetOverallMessData);

router.route("/entry-mess-qr").post(entryMessQR);

router.route("/mess-data-byDate/:date").get(getMessDataByDate);

router.route("/mess-data-byrollnumber/:rollNumber").get(getDataByRollNumber);

export default router;
