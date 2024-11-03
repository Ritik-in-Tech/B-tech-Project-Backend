import { validMessNames } from "../../../constant.js";
import { ApiResponse } from "../../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../../helpers/response/asynchandler.js";
import {
  convertToIST,
  getCurrentIndianTime,
} from "../../../helpers/time/time.helper.js";
import { Mess } from "../../../models/mess.model.js";

export const GetOverallMessData = asyncHandler(async (req, res) => {
  try {
    const role = req.user.role;
    if (!role) {
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid token! Please login again."));
    }

    if (role === "students") {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            "Only admin and mess staff can access the mess data"
          )
        );
    }

    const { messName } = req.params;
    if (!messName) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Mess name is required in params"));
    }

    if (!validMessNames.includes(messName)) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid mess name"));
    }

    const istDateTime = getCurrentIndianTime();

    const todayStartUTC = new Date(istDateTime.setHours(0, 0, 0, 0));
    const todayStartIST = convertToIST(todayStartUTC);

    const todaysEndUTC = new Date(istDateTime.setHours(23, 59, 59, 59));
    const todaysEndIST = convertToIST(todaysEndUTC);

    const prevDayStartUTC = new Date(todayStartUTC);
    prevDayStartUTC.setDate(prevDayStartUTC.getDate() - 1);
    const prevDayStartIST = convertToIST(prevDayStartUTC);
    const prevDayEndUTC = new Date(todaysEndUTC);
    prevDayEndUTC.setDate(prevDayEndUTC.getDate() - 1);
    const prevDayEndIST = convertToIST(prevDayEndUTC);

    const nextDayStartUTC = new Date(todayStartUTC);
    nextDayStartUTC.setDate(nextDayStartUTC.getDate() + 1);
    const nextDayStartIST = convertToIST(nextDayStartUTC);

    // console.log(nextDayStartIST);
    const nextDayEndUTC = new Date(todaysEndUTC);
    nextDayEndUTC.setDate(nextDayEndUTC.getDate() + 1);
    const nextDayEndIST = convertToIST(nextDayEndUTC);
    // console.log(nextDayEndIST);

    const studentCount = await Mess.find({
      mess: messName,
      $or: [
        { startDate: { $lte: todaysEndIST }, endDate: { $gte: todayStartIST } },
        {
          startDate: { $lte: prevDayEndIST },
          endDate: { $gte: prevDayStartIST },
        },
        {
          startDate: { $lte: nextDayEndIST },
          endDate: { $gte: nextDayStartIST },
        },
      ],
    });

    // console.log(studentCount);

    const todayCount = studentCount.filter(
      (doc) => doc.startDate <= todaysEndIST && doc.endDate >= todayStartIST
    ).length;

    const previousDayCount = studentCount.filter(
      (doc) => doc.startDate <= prevDayEndIST && doc.endDate >= prevDayStartIST
    ).length;

    const nextDayCount = studentCount.filter(
      (doc) => doc.startDate <= nextDayEndIST && doc.endDate >= nextDayStartIST
    ).length;

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { previousDayCount, todayCount, nextDayCount },
          "Student count fetched successfully"
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, { error }, "Internal Server Error"));
  }
});
