import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { getStatusMessage } from "../../helpers/response/statuscode.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const role = req.user.role;

    if (!role) {
      return res
        .status(401)
        .json(
          new ApiResponse(
            401,
            {},
            getStatusMessage(401) + " : Token is not valid"
          )
        );
    }

    if (role !== "admin") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            getStatusMessage(403) + " : Only admin can get all Users"
          )
        );
    }

    const users = await User.find({ role: "students" }).select(
      "email rollNumber _id isProfileComplete"
    );

    if (users.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            getStatusMessage(200) + " : Not any registered users found"
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { users },
          getStatusMessage(200) + " All registered users fetched successfully!"
        )
      );
  } catch (err) {
    // console.log(err);

    return res
      .status(500)
      .json(new ApiResponse(500, { err }, getStatusMessage(500)));
  }
});

export const getUser = asyncHandler(async (req, res) => {
  try {
    const role = req.user.role;

    if (role === "students") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            getStatusMessage(403) +
              ": Only admin and mess person can get user details"
          )
        );
    }

    const { rollNumber } = req.params;
    if (!rollNumber) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) + ": Roll number is not provided in params"
          )
        );
    }

    let user = await User.findOne({ rollNumber: rollNumber }).select(
      "email rollNumber _id"
    );
    if (!user) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, {}, getStatusMessage(404) + ": User not found")
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user },
          getStatusMessage(200) + ": User fetched successfully!"
        )
      );
  } catch (error) {}
});
