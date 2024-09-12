import { messTime, validMessNames } from "../../constant.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { getStatusMessage } from "../../helpers/response/statuscode.js";
import {
  getCurrentHoursMinutes,
  getCurrentIndianTime,
} from "../../helpers/time/time.helper.js";
import { Mess } from "../../models/mess.model.js";

export const EntryDataMess = asyncHandler(async (req, res) => {
  try {
    const { userId, mess } = req.body;
    if (!userId || !mess) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) +
              ": userId or mess is not provided in the body"
          )
        );
    }

    if (!validMessNames.includes(mess)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) +
              ": Not a valid mess name, Only Old or New are valid"
          )
        );
    }

    const messDetail = await Mess.findOne({
      userId: userId,
      mess: mess,
    }).select("startDate endDate data");

    if (!messDetail) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            {},
            getStatusMessage(404) + ": Mess detail not found for this user"
          )
        );
    }

    const startDate = messDetail.startDate;
    const endDate = messDetail.endDate;

    const istDate = getCurrentIndianTime();
    // console.log(istDate);
    const { currentHour, currentMinute } = getCurrentHoursMinutes(istDate);
    const currentTime = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;

    // console.log(currentTime);

    const isTimeInRange = (start, end) =>
      currentTime >= start && currentTime <= end;

    // Determine current meal
    let currentMeal = null;
    for (const [meal, { start, end }] of Object.entries(messTime)) {
      if (isTimeInRange(start, end)) {
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

    // console.log(currentMeal);

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

    // console.log(messDetail);

    const mealData = messDetail.data || [];

    // console.log(mealData);

    const hasTakenMeal = mealData.some(
      (entry) =>
        entry.type === currentMeal &&
        entry.date.toISOString().slice(0, 10) ===
          istDate.toISOString().slice(0, 10) &&
        entry.isDone
    );

    // console.log(hasTakenMeal);

    if (hasTakenMeal) {
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

    mealData.push({
      date: istDate,
      type: currentMeal,
      isDone: true,
    });

    messDetail.data = mealData;
    await messDetail.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { message: "Meal entry created successfully" },
          getStatusMessage(200)
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          { error },
          getStatusMessage(500) + ": Internal server error"
        )
      );
  }
});
