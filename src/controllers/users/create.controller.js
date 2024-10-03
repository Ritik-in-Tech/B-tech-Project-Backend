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

export const registerUser = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { email, rollnumber, password, fingerprintKey, fingerprintUrl } =
      req.body;
    if (!email || !rollnumber || !password) {
      // console.log("Incomplete info");
      return res
        .status(400)
        .json(
          new ApiResponse(400, {}, "Please provide all the required fields")
        );
    }

    if (!validateIITJEmail(email)) {
      // console.log(`Invalid Email: ${email}`);
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
      // console.log(`Invalid rollnumber: ${rollnumber}`);
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

    const existingUser = await User.findOne({ email: email }).session(session);
    if (existingUser) {
      await session.abortTransaction();
      return res
        .status(400)
        .json(new ApiResponse(400, {}, `This email is already used`));
    }

    const existingUserRollNumber = await User.findOne({
      rollNumber: rollnumber,
    }).session(session);

    if (existingUserRollNumber) {
      await abortTransaction();
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
      fingerprintKey: fingerprintKey,
      fingerprintImageUrl: fingerprintUrl,
    });

    await user.save({ session });

    const { qrCodeDataURL, rollHash } = await generateQRDataURL(rollnumber);

    // Upload QR Code to AWS S3
    const qrCodeURL = await uploadQRToS3(qrCodeDataURL, rollnumber);

    // Prepare Email Options
    const mailOptions = {
      from: `"IITJ MESS PORTAL" <${process.env.EMAIL_FROM}>`, // Sender address
      to: email, // Receiver's email
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

    await session.commitTransaction();
    session.endSession(); // End the session

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          {},
          "User registered successfully! Please check your email for the QR code."
        )
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res
      .status(500)
      .json(new ApiResponse(500, { error }, "Internal server error"));
  }
});
