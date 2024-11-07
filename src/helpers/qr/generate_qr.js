// import QRCode from "qrcode";

// export const generateQRCode = async (text) => {
//   try {
//     const options = {
//       width: 300,
//       color: {
//         dark: "#FF0000",
//         light: "#FFFFFF",
//       },
//     };

//     const qrCodeData = await QRCode.toDataURL(text, options);
//     return qrCodeData;
//   } catch (error) {
//     throw new Error("Failed to generate QR code");
//   }
// };

// src/helpers/qr/generate_qr.js

import QRCode from "qrcode";
import crypto from "crypto";

/**
 * Generates a hashed value for the roll number using HMAC SHA256.
 * @param {string} rollnumber - The user's roll number.
 * @returns {string} - The hashed roll number.
 */
const generateRollHash = (rollnumber) => {
  const secret = process.env.QR_SECRET_KEY;
  return crypto.createHmac("sha256", secret).update(rollnumber).digest("hex");
};

/**
 * Generates a QR code data URL containing the hashed roll number.
 * @param {string} rollnumber - The user's roll number.
 * @returns {Promise<{ qrCodeDataURL: string, rollHash: string }>} - The QR code as a Data URL.
 */
const generateQRDataURL = async (rollnumber) => {
  const rollHash = generateRollHash(rollnumber);
  const qrData = rollHash;
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
