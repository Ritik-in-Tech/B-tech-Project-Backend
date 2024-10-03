import { encrypt } from "../../helpers/encryption/encrypt_key.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { User } from "../../models/user.model.js";

export const getAnsiKey = asyncHandler(async (req, res) => {
  try {
    const { rollNumber } = req.params;
    if (!rollNumber) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Roll number is not provided in the params")
        );
    }

    const user = await User.findOne({ rollNumber: rollNumber });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    const fingerprintKey = user.fingerprintKey;
    if (!fingerprintKey) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Fingerprint key not found"));
    }

    const encryptedKey = encrypt(fingerprintKey);

    return res
      .status(200)
      .json(new ApiResponse(200, { fingerprintKey: encryptedKey }, "Success"));
  } catch (error) {
    console.error("Error in getAnsiKey:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, { error: error.message }, "Internal server error")
      );
  }
});
