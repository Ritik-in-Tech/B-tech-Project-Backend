import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { getStatusMessage } from "../../helpers/response/statuscode.js";
import { User } from "../../models/user.model.js";
import mongoose from "mongoose";
import stringSimilarity from "string-similarity";

export const verifyFinger = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { fingerprintKey, rollNumber } = req.body;
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

    const user = await User.findOne({ rollNumber: rollNumber });

    // const user = await User.findOne({}) // Removed filtering by fingerprintKey for now
    //   .select("_id fingerprintKey rollNumber")
    //   .session(session);

    if (!user) {
      await session.abortTransaction();
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            {},
            getStatusMessage(404) + ": No users found with a fingerprintKey"
          )
        );
    }

    // Calculate similarity between provided fingerprintKey and the stored one
    const similarity = stringSimilarity.compareTwoStrings(
      fingerprintKey,
      user.fingerprintKey
    );

    const similarityPercentage = similarity * 100; // Convert to percentage

    if (similarityPercentage < 60) {
      await session.abortTransaction();
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            { similarityPercentage },
            getStatusMessage(400) + ": Fingerprint similarity is below 60%"
          )
        );
    }

    await session.commitTransaction();
    session.endSession();

    const userId = user._id;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userId, similarityPercentage },
          getStatusMessage(200) +
            `: UserId fetched successfully with ${similarityPercentage}% similarity!`
        )
      );
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
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
