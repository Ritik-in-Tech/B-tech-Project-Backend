import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadQRToS3 = async (qrCodeData, rollNumber) => {
  try {
    const base64Data = new Buffer.from(
      qrCodeData.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `qr-codes/${rollNumber}.png`,
      Body: base64Data,
      ContentEncoding: "base64",
      ContentType: "image/png",
    };

    const uploadResult = await s3.upload(params).promise();

    return uploadResult.Location;
  } catch (error) {
    // console.error("Error details: ", error);
    throw new Error(`Failed to upload QR code to S3: ${error.message}`);
  }
};
