import { validMessNames } from "../../constant.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { getStatusMessage } from "../../helpers/response/statuscode.js";
import { convertToIST } from "../../helpers/time/time.helper.js";
import { Mess } from "../../models/mess.model.js";
import { User } from "../../models/user.model.js";
import mongoose from "mongoose";

export const chooseMess = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const role = req.user.role;
    if (role === "admin" || role === "mess") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            getStatusMessage(403) + ": Only student can choose mess facility"
          )
        );
    }

    const userId = req.user._id;
    // console.log(userId);
    if (!userId) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) + ": UserId not found in jwt decoded token"
          )
        );
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, getStatusMessage(400) + ": User not found")
        );
    }

    const { startDate, endDate, mess } = req.body;
    if (!startDate || !endDate || !mess) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) + ": Start, end Date or mess is not provided"
          )
        );
    }

    if (!validMessNames.includes(mess)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) +
              ": Not a valid mess name, Only Old or New are valid"
          )
        );
    }

    const start = new Date(startDate);
    let end = new Date(endDate);
    const today = new Date();
    const istToday = convertToIST(today);

    end.setUTCHours(23, 59, 59, 999);

    // console.log(start);
    // console.log(end);
    // console.log(istToday);
    // console.log(start <= istToday);

    // if (start > istToday) {
    //   return res
    //     .status(400)
    //     .json(
    //       new ApiResponse(
    //         400,
    //         {},
    //         getStatusMessage(400) +
    //           ": Start date and end date must be after the current date."
    //       )
    //     );
    // }
    if (start > end) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) + ": End date is not before start date"
          )
        );
    }

    const existAlready = await Mess.findOne({
      userId: userId,
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
        {
          startDate: { $gte: start, $lte: end },
          endDate: { $gte: start, $lte: end },
        },
      ],
    }).session(session);

    if (existAlready) {
      await session.abortTransaction();
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) +
              ": There is already choosen mess for the given user in the given span"
          )
        );
    }

    const messData = new Mess({
      userId: userId,
      mess: mess,
      startDate: start,
      endDate: end,
    });

    await messData.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          getStatusMessage(200) + ": Mess date added successfully!"
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          { error },
          getStatusMessage(500) + ": Internal server error"
        )
      );
  }
});
