import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const uploadQRToS3 = async (qrDataURL, rollnumber) => {
  const base64Data = qrDataURL.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const key = `qr_codes/${rollnumber}.png`;

  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      })
    );

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    if (error.name !== "NotFound") {
      console.error("Error checking or deleting existing QR code:", error);
      throw new Error("Error handling existing QR code on AWS S3.");
    }
    // console.log("Error checking or deleting existing QR code:", error);
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `qr_codes/${rollnumber}.png`,
    Body: buffer,
    ContentType: "image/png",
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return imageUrl;
  } catch (error) {
    throw new Error("Failed to upload QR code to AWS S3.");
  }
};

export { uploadQRToS3 };
