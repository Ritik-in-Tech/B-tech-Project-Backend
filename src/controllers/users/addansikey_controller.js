import { encrypt } from "../../helpers/encryption/encrypt_key.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { User } from "../../models/user.model.js";

export const addAnsiKey = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Id is not provided in the params"));
    }

    const { ansiKey, ansiImageUrl } = req.body;
    if (!ansiKey || !ansiImageUrl) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Ansi Key or AnsiImageUrl is not provided in the body"
          )
        );
    }

    const existUser = await User.findById(userId);
    if (!existUser) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    const encryptedAnsiKey = encrypt(ansiKey);
    existUser.fingerprintKey = encryptedAnsiKey;
    existUser.fingerprintImageUrl = ansiImageUrl;
    existUser.isProfileComplete = true;
    await existUser.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User key added successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, { error }, "Failed to add user key"));
  }
});
