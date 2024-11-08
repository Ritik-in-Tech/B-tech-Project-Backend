import { asyncHandler } from "../../helpers/response/asynchandler.js";
import { ApiResponse } from "../../helpers/response/apiresponse.js";
import { User } from "../../models/user.model.js";
import { generateQRDataURL } from "../../helpers/qr/generate_qr.js";
import mongoose from "mongoose";
import { uploadQRToS3 } from "../../helpers/qr/upload_qr_aws.js";
import { sendEmail } from "../../helpers/email/send_email.js";
import { convertToIST } from "../../helpers/time/time.helper.js";
import generateQRCodePDF from "../../helpers/qr/generate_qrcode_pdf.js";

export const generateQr = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const role = req.user.role;
    if (!role) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid token! Please login again."));
    }

    if (role !== "students") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json(
          new ApiResponse(403, {}, "Only students can generate a new QR code.")
        );
    }

    const userId = req.user._id;
    if (!userId) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "UserId not found from the token."));
    }

    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json(new ApiResponse(404, {}, "User not found."));
    }

    const rollNumber = user.rollNumber;
    const email = user.email;

    let qrCodeDataURL;
    let rollHash;
    let now = convertToIST(new Date());

    if (user.qrLastGenerated) {
      const diffDays = Math.floor(
        (now.getTime() - user.qrLastGenerated.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 7) {
        await session.abortTransaction();
        session.endSession();
        return res
          .status(403)
          .json(
            new ApiResponse(
              403,
              {},
              "You can generate a new QR code only once a week."
            )
          );
      }
    }

    ({ qrCodeDataURL, rollHash } = await generateQRDataURL(rollNumber));
    // console.log(now);
    user.qrLastGenerated = now;
    user.rollHash = rollHash;
    await user.save({ session });

    const qrCodeURL = await uploadQRToS3(qrCodeDataURL, rollNumber);

    const pdfBuffer = await generateQRCodePDF(qrCodeDataURL, rollnumber);

    const mailOptions = {
        from: `"IITJ MESS PORTAL" <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: "Welcome! Here is your QR Code PDF",
        html: `
          <p>Thank you for registering.</p>
          <p>Your Roll Number: ${rollnumber}</p>
          <p>Your unique QR Code is attached in the PDF file.</p>
          <p>Please keep this PDF safe. It contains your unique identifier.</p>
        `,
        attachments: [
          {
            filename: `${rollnumber}-QRCode.pdf`,
            content: pdfBuffer,
          },
        ],
      };

    await sendEmail(mailOptions);

    await session.commitTransaction();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "New QR generated successfully."));
  } catch (error) {
    await session.abortTransaction();
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          { error },
          "Internal server error: Failed to generate QR."
        )
      );
  } finally {
    session.endSession();
  }
});
