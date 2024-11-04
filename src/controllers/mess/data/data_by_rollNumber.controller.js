import { ApiResponse } from "../../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../../helpers/response/asynchandler.js";
import { Mess } from "../../../models/mess.model.js";
import { User } from "../../../models/user.model.js";

export const getDataByRollNumber = asyncHandler(async (req, res) => {
  try {
    const role = req.user.role;
    if (!role) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Invalid token please log in again"));
    }

    if (role === "students") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "Only mess and admin staff are allowed to get the mess data"
          )
        );
    }

    const { rollNumber } = req.params;
    if (!rollNumber) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Roll number is not provided in params")
        );
    }

    const user = await User.findOne({ rollNumber: rollNumber }).select("_id");
    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    const userId = user._id;
    // console.log(userId);

    const messDetail = await Mess.find({ userId: userId });
    // console.log(messDetail);

    const messDetailMap = new Map();

    for (const data of messDetail) {
      const messName = data.mess;

      const dataMap = data.data;
      //   console.log(dataMap);

      for (const [date, meals] of dataMap) {
        const dataEntry = {
          messName,
          meals: meals.map((meal) => ({
            type: meal.type,
          })),
        };

        messDetailMap.set(date, dataEntry);
      }
    }

    // console.log(messDetailMap);

    if (messDetailMap.size === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "This user have not gone to mess yet!"));
    }

    const responseData = Object.fromEntries(messDetailMap);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          responseData,
          `Successfully fetched mess details for roll number ${rollNumber}`
        )
      );
  } catch (error) {
    console.error("Error in getDataByRollNumber:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "An error occurred while fetching data"));
  }
});
