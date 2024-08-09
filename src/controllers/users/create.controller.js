import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { User } from "../../models/user.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    let { email, rollnumber, password } = req.body;
    if (!email || !rollnumber || !password) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Please provide all the required fields")
        );
    }

    const user = new User({
      email: email,
      rollNumber: rollnumber,
      password: password,
    });

    await user.save();

    return res
      .status(201)
      .json(new ApiResponse(201, {}, "User registered successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, { error }, "Internal server error"));
  }
});
