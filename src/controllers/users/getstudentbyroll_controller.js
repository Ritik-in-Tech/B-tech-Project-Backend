import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { User } from "../../models/user.model.js";

export const getStudentByRollNumber = asyncHandler(async (req, res) => {
  try {
    const role = req.user.role;
    if (!role) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid token! Please login again."));
    }

    if (role !== "admin") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "Only admin can access to get user details via RollNumber."
          )
        );
    }

    const { rollNumber } = req.params;
    if (!rollNumber) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Roll Number is required."));
    }

    const user = await User.findOne({ rollNumber: rollNumber }).select(
      "email isProfileComplete _id"
    );
    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    res.json(new ApiResponse(200, user, "User details fetched successfully."));
  } catch (error) {
    console.error("Error in getStudentByRollNumber:", error);
    res
      .status(500)
      .json(new ApiResponse(500, { error }, "Failed to get user details."));
  }
});
