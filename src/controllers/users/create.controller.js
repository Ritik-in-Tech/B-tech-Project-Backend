import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { User } from "../../models/user.model.js";
import {
  validateIITJEmail,
  validatePassword,
  validateRollNumber,
} from "../../helpers/schema/validateiitjemail.js";

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

    if (!validateIITJEmail(email)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            `${email} is not a valid IITJ email address!`
          )
        );
    }

    if (!validateRollNumber(rollnumber)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            `Roll number must contain only uppercase letters and numbers.`
          )
        );
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            `Minimun password length should be greater than 7`
          )
        );
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `This email is already used`));
    }

    const existingUserRollNumber = await User.findOne({
      rollNumber: rollnumber,
    });

    if (existingUserRollNumber) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, `This rollNumber is already registered`)
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
