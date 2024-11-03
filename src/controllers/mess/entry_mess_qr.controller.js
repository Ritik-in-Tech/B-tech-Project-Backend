import mongoose from "mongoose";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { User } from "../../models/user.model.js";
import {
  messTime,
  validMessNames,
  validNewMessEmail,
  validOldMessEmail,
} from "../../constant.js";
import { Mess } from "../../models/mess.model.js";
import {
  getCurrentHoursMinutes,
  getCurrentIndianTime,
} from "../../helpers/time/time.helper.js";
import { getStatusMessage } from "../../helpers/response/statuscode.js";
import { isTimeInRange } from "../../helpers/time/entry_time_match.js";
import { addOrUpdateEntry } from "../../helpers/schema/mess_entry.js";

export const entryMessQR = asyncHandler(async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const role = req.user.role;
    if (!role) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid token! Please login again."));
    }

    if (role !== "mess") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "Only mess staff can do the entry for the students"
          )
        );
    }

    const reqUserEmail = req.user.email;
    if (!reqUserEmail) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid token! Please login again."));
    }

    let mess;
    if (validOldMessEmail.includes(reqUserEmail)) {
      mess = "Old";
    } else if (validNewMessEmail.includes(reqUserEmail)) {
      mess = "New";
    }

    const { rollHash } = req.body;
    if (!rollHash) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Hash is missing from Body request"));
    }

    if (!validMessNames.includes(mess)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid mess name."));
    }

    const user = await User.findOne({ rollHash: rollHash }).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    if (user.role !== "students") {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "Roll hash is not setup correctly."));
    }

    const userId = user._id;
    // console.log(userId);
    const messDetail = await Mess.findOne({ userId: userId, mess: mess })
      .select("startDate endDate data")
      .session(session);

    if (!messDetail) {
      await session.abortTransaction();
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            {},
            "Please check once again I think you have registered other mess"
          )
        );
    }

    const startDate = messDetail.startDate;
    const endDate = messDetail.endDate;

    const istDate = getCurrentIndianTime();
    // console.log(istDate);

    if (startDate > istDate || istDate > endDate) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) + ": You have not permission to eat today"
          )
        );
    }
    const { currentHour, currentMinute } = getCurrentHoursMinutes(istDate);
    const currentTime = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;

    // console.log(currentTime);

    // console.log(start, end);
    // Determine current meal
    let currentMeal = null;
    for (const [meal, { start, end }] of Object.entries(messTime)) {
      // console.log(start, end, meal);
      if (isTimeInRange(start, end, currentTime)) {
        currentMeal = meal;
        break;
      }
    }

    if (!currentMeal) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) +
              ": No meal service is available at this time"
          )
        );
    }

    const dateKey = istDate.toISOString().split("T")[0];

    // console.log(messDetail.data);

    const existingEntries = messDetail.data.get(dateKey) || [];

    for (const existingEntry of existingEntries) {
      if (existingEntry.type === currentMeal && existingEntry.isDone) {
        await session.abortTransaction();
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              {},
              getStatusMessage(400) +
                ": You have already taken this meal for today"
            )
          );
      }
    }

    await addOrUpdateEntry(messDetail, istDate, currentMeal, true);

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Meal Record successfully"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, {}, "An error occurred."));
  }
});
