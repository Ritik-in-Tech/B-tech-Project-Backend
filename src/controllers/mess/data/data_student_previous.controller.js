import { ApiResponse } from "../../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../../helpers/response/asynchandler.js";
import { Mess } from "../../../models/mess.model.js";

export const getStudentPreviousData = asyncHandler(async (req, res) => {
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
            "Only students can access their previous data."
          )
        );
    }

    const id = req.user._id;
    if (!id) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User ID is required."));
    }

    const messDetails = await Mess.find({ userId: id });
    // console.log(messDetails);

    if (messDetails.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "No mess details found."));
    }
    const filterData = messDetails
      .map(({ mess, startDate, endDate }) => ({
        mess,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      }))
      .reverse();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { filterData },
          "Previous data retrieved successfully."
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(
        new ApiResponse(
          500,
          { error: error.message },
          "An error occurred while retrieving the previous data."
        )
      );
  }
});
