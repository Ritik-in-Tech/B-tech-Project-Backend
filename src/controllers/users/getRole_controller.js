import { encrypt } from "../../helpers/encryption/encrypt_key.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { getStatusMessage } from "../../helpers/response/statuscode.js";

export const getRole = asyncHandler(async (req, res) => {
  try {
    const userDetails = req.user;
    if (!userDetails) {
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

    const role = userDetails.role;
    const id = userDetails._id;

    const encryptedId = encrypt(id);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { role, encryptedId },
          getStatusMessage(200) + " User role fetched successfully!"
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, { error }, getStatusMessage(500)));
  }
});
