import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { User } from "../../models/user.model.js";
import {
  validateIITJEmail,
  validatePassword,
  validateRollNumber,
} from "../../helpers/schema/validateiitjemail.js";
import { generateQRDataURL } from "../../helpers/qr/generate_qr.js";
import { uploadQRToS3 } from "../../helpers/qr/upload_qr_aws.js";
import { sendEmail } from "../../helpers/email/send_email.js";
import mongoose from "mongoose";
import { validAdminEmail, validMessEmail, validRoles } from "../../constant.js";

export const registerUser = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { role, email, rollnumber, password } = req.body;

    if (!role || !email || !password) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Please provide all the required fields")
        );
    }

    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Invalid role. Please choose between 'admin', 'students', or 'mess'"
          )
        );
    }

    if (role === "admin" && !validAdminEmail.includes(email)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Provided admin email is not allowed. Please provide a valid admin email."
          )
        );
    }

    if (role === "mess" && !validMessEmail.includes(email)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Provided mess email is not allowed. Please provide a valid mess email."
          )
        );
    }

    if (role === "students") {
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
      if (!rollnumber) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              {},
              "Please provide a roll number for students."
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
              "Roll number must contain only uppercase letters and numbers."
            )
          );
      }
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Minimum password length should be greater than 5"
          )
        );
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email: email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "This email is already used"));
    }

    // Check if roll number is already registered (only for students)
    if (role === "students") {
      const existingUserRollNumber = await User.findOne({
        rollNumber: rollnumber,
      }).session(session);
      if (existingUserRollNumber) {
        await session.abortTransaction();
        return res
          .status(400)
          .json(
            new ApiResponse(400, {}, "This roll number is already registered")
          );
      }
    }

    // Create the user based on the role
    let userObj = {
      role: role,
      email: email,
      password: password,
      isProfileComplete: role !== "students", // Set to true for admin/mess, false for students
    };

    // Only add rollNumber for students
    if (role === "students") {
      userObj.rollNumber = rollnumber;
    }

    const user = new User(userObj);
    await user.save({ session });

    if (role === "students") {
      // Generate and send QR code for students
      const { qrCodeDataURL, rollHash } = await generateQRDataURL(rollnumber);
      const qrCodeURL = await uploadQRToS3(qrCodeDataURL, rollnumber);

      // Prepare and send email
      const mailOptions = {
        from: `"IITJ MESS PORTAL" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "Welcome! Here is your QR Code",
        html: `
          <p>Thank you for registering.</p>
          <p>Your Roll Number: ${rollnumber}</p>
          <p>Here is your secure QR Code:</p>
          <img src="${qrCodeURL}" alt="QR Code" />
          <p>Please keep this QR code safe. It contains your unique identifier.</p>
        `,
      };

      await sendEmail(mailOptions);
    }

    await session.commitTransaction();
    session.endSession();

    if (role === "students") {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            "User registered successfully! Please check your email for the QR code."
          )
        );
    } else {
      return res
        .status(201)
        .json(new ApiResponse(201, {}, "User registered successfully!"));
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, { error: error.message }, "Internal server error")
      );
  }
});
