import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { getStatusMessage } from "../../helpers/response/statuscode.js";
import { User } from "../../models/user.model.js";

export const verifyFinger = asyncHandler(async (req, res) => {
  try {
    const { fingerprintKey } = req.body;
    if (!fingerprintKey) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) +
              ": fingerprintkey is not provided in the body"
          )
        );
    }

    const user = await User.findOne({ fingerprintKey: fingerprintKey }).select(
      "_id"
    );
    // console.log(user);
    if (!user) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            {},
            getStatusMessage(404) + ": Fingerprint is not registered"
          )
        );
    }

    const userId = user._id;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userId },
          getStatusMessage(200) + ": UserId fetched successfully!"
        )
      );
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          { err },
          getStatusMessage(500) + "Internal server error"
        )
      );
  }
});
