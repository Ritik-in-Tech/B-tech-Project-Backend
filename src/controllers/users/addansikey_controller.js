import mongoose from "mongoose";
import { encrypt } from "../../helpers/encryption/encrypt_key.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { User } from "../../models/user.model.js";

export const addAnsiKey = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const role = req.user.role;
    if (role !== "admin") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "Only admin can add ansi Keys for the students"
          )
        );
    }

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

    const existUser = await User.findById(userId).session(session);
    if (!existUser) {
      await session.abortTransaction();
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    if (existUser.isProfileComplete) {
      await session.abortTransaction();
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "User profile is already complete"));
    }

    const encryptedAnsiKey = encrypt(ansiKey);
    existUser.fingerprintKey = encryptedAnsiKey;
    existUser.fingerprintImageUrl = ansiImageUrl;
    existUser.isProfileComplete = true;
    await existUser.save();

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User key added successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, { error }, "Failed to add user key"));
  }
});
