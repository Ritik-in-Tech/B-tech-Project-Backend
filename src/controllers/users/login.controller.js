import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { getStatusMessage } from "../../helpers/response/statuscode.js";
import { comparePassword } from "../../helpers/schema/passwordhash.js";
import { User } from "../../models/user.model.js";

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { rollnumber, password } = req.body;
    if (!rollnumber || !password) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            getStatusMessage(400) + ": Please provide all the required fields"
          )
        );
    }

    const exist = await User.findOne({
      rollNumber: rollnumber,
    });

    if (!exist) {
      return res
        .status(401)
        .json(
          new ApiResponse(
            401,
            {},
            getStatusMessage(401) +
              ": User is not registred. Please sign up first"
          )
        );
    }

    if (!(await comparePassword(password, exist.password))) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            403,
            {},
            getStatusMessage(403) + ": Password is wrong"
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          getStatusMessage(200) + ": User logged in successfully"
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          {},
          getStatusMessage(500) + ": Internal server error"
        )
      );
  }
});
