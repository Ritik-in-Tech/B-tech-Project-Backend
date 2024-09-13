import QRCode from "qrcode";

export const generateQRCode = async (text) => {
  try {
    const options = {
      width: 300,
      color: {
        dark: "#FF0000",
        light: "#FFFFFF",
      },
    };

    const qrCodeData = await QRCode.toDataURL(text, options);
    return qrCodeData;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};
