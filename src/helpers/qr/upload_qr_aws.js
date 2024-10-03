// import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// export const uploadQRToS3 = async (qrCodeData, rollNumber) => {
//   try {
//     const base64Data = new Buffer.from(
//       qrCodeData.replace(/^data:image\/\w+;base64,/, ""),
//       "base64"
//     );

//     const params = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: `qr-codes/${rollNumber}.png`,
//       Body: base64Data,
//       ContentEncoding: "base64",
//       ContentType: "image/png",
//     };

//     const uploadResult = await s3.upload(params).promise();

//     return uploadResult.Location;
//   } catch (error) {
//     // console.error("Error details: ", error);
//     throw new Error(`Failed to upload QR code to S3: ${error.message}`);
//   }
// };


// src/helpers/qr/upload_qr_aws.js

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

/**
 * Uploads a QR code image to AWS S3.
 * @param {string} qrDataURL - The QR code as a Data URL.
 * @param {string} rollnumber - The user's roll number.
 * @returns {Promise<string>} - The URL of the uploaded QR code.
 */


const uploadQRToS3 = async (qrDataURL, rollnumber) => {
  // Extract Base64 data from Data URL
  const base64Data = qrDataURL.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `qr_codes/${rollnumber}.png`, // Adjust the path as needed
    Body: buffer,
    ContentType: 'image/png',
    // ACL: 'public-read', // Make the file publicly readable
  };

  const command = new PutObjectCommand(params);
  try {
    await s3.send(command);
    const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return imageUrl;
  } catch (error) {
    // console.error("Error uploading QR code to S3:", error);
    // console.error("Error message:", error.message);
    // console.error("Error code:", error.code);
    // console.error("Error stack:", error.stack);
    throw new Error('Failed to upload QR code to AWS S3.');
  }
};

export { uploadQRToS3 };
