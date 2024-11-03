import { ApiResponse } from "../../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../../helpers/response/asynchandler.js";
import { Mess } from "../../../models/mess.model.js";
import { User } from "../../../models/user.model.js";

export const getMessDataByDate = asyncHandler(async (req, res) => {
  try {
    const role = req.user.role;
    if (!role) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Invalid token please log in again."));
    }

    if (role === "students") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "Only admin and mess staff can view the mess data"
          )
        );
    }

    const { date } = req.params;
    if (!date) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Date is required in params"));
    }
    // console.log(date);
    const formattedDate = new Date(date).toISOString().split("T")[0];

    // console.log(formattedDate);

    const messDataDetail = await Mess.find({
      [`data.${formattedDate}`]: { $exists: true },
    });
    // console.log(messDataDetail);

    const messDetailMap = new Map();

    for (const data of messDataDetail) {
      const student = await User.findById(data.userId);
      const rollNumber = student.rollNumber;
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

      messDetailMap.set(rollNumber, studentEntry);
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
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          { error },
          "An error occurred while fetching mess data."
        )
      );
  }
});
