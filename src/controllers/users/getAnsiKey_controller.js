import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { User } from "../../models/user.model.js";

export const getAnsiKey = asyncHandler(async (req, res) => {
  try {
    const role = req.user.role;

    if (!role) {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "Invalid token! Please login again."));
    }

    if (role !== "mess") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "Only mess authorized person can get the encrypted ansi key"
          )
        );
    }

    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "UserID is not provided in the params"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    const fingerprintKey = user.fingerprintKey;
    if (!fingerprintKey) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Fingerprint key not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, { fingerprintKey: fingerprintKey }, "Success")
      );
  } catch (error) {
    console.error("Error in getAnsiKey:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, { error: error.message }, "Internal server error")
      );
  }
});
