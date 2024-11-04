import { asyncHandler } from "../../../helpers/response/asynchandler.js";
import { ApiResponse } from "../../../helpers/response/apiresponse.js";
import { Mess } from "../../../models/mess.model.js";

export const getStudentDataByDate = asyncHandler(async (req, res) => {
  try {
    const role = req.user.role;
    if (!role) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid token! Please login again."));
    }

    if (role !== "students") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "Only students can access to get their specific data."
          )
        );
    }

    const userId = req.user._id;
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "UserId is not found from the token"));
    }

    const { date } = req.params;
    if (!date) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Date is not provided in params"));
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];

    const messDetails = await Mess.find({
      userId: userId,
      [`data.${formattedDate}`]: { $exists: true },
    });

    // console.log(messDetails[0]);

    if (messDetails.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            `You have not gone to any of the mess on the provided date ${date} `
          )
        );
    }

    const messDetailMap = new Map();

    for (const data of messDetails) {
      const messName = data.mess;

      const dateKey = formattedDate;
      const dateEntries = data.data.get(dateKey);

      const studentEntry = {
        messName,
        mealsTaken: [],
      };

      if (dateEntries) {
        studentEntry.mealsTaken = dateEntries.map((entry) => ({
          type: entry.type,
        }));
      }

      messDetailMap.set(formattedDate, studentEntry);
    }

    const responseData = Object.fromEntries(messDetailMap);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          `Successfully fetched mess details for ${formattedDate}`
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(500, { error }, "Internal Server Error"));
  }
});
