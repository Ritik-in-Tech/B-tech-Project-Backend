import QRCode from "qrcode";
import crypto from "crypto";
import { encrypt } from "../encryption/encrypt_key.js";

const generateRollHash = (rollnumber) => {
  const now = new Date();
  const dateStr = now.toISOString();
  const text = `${rollnumber}_${dateStr}`;
  const secret = process.env.QR_SECRET_KEY;
  return crypto.createHmac("sha256", secret).update(text).digest("hex");
};

const generateQRDataURL = async (rollnumber) => {
  const rollHash = generateRollHash(rollnumber);
  const encryptRollHash = encrypt(rollHash);
  const qrData = encryptRollHash;
  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      color: {
        dark: "#FF0000",
        light: "#FFFFFF",
      },
    });
    return { qrCodeDataURL, rollHash };
  } catch (error) {
    throw new Error("Failed to generate QR code.");
  }
};

export { generateQRDataURL, generateRollHash };
