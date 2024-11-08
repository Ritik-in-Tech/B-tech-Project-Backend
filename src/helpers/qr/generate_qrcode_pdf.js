// generateQRCodePDF.js

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

async function generateQRCodePDF(qrCodeDataURL, rollnumber) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });
  const qrCodeImagePath = path.join(process.cwd(), `${rollnumber}-QRCode.png`);

  // Convert QR code Data URL to image and save it temporarily
  const qrImageBuffer = Buffer.from(qrCodeDataURL.split(",")[1], "base64");
  fs.writeFileSync(qrCodeImagePath, qrImageBuffer);

  // Create a buffer to store PDF data
  const pdfBuffer = await new Promise((resolve) => {
    const buffer = [];
    doc.on("data", (chunk) => buffer.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffer)));

    // Header
    doc.fontSize(26).fillColor("#0073e6").text("Welcome to IITJ Mess Portal", {
      align: "center",
    });
    doc.moveDown();
    doc.fontSize(18).fillColor("#333333").text("Student QR Code for Mess Attendance", {
      align: "center",
    });
    doc.moveDown(2);

    // Add a line separator
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#0073e6").stroke();
    doc.moveDown(2);

    // Student Roll Number Section
    doc.fontSize(16).fillColor("#333333").text(`Roll Number: ${rollnumber}`, {
      align: "left",
    });
    doc.moveDown(1);

    // Instruction Section
    doc.fontSize(12).fillColor("#666666").text("Please scan the QR code below at the mess entrance to mark your attendance.", {
      align: "left",
    });
    doc.moveDown(2);

    // Add a background for the QR code section
    doc.rect(150, doc.y, 250, 250).fill("#f0f8ff").stroke("#0073e6");
    doc.moveDown();

    // Insert QR code image
    doc.image(qrCodeImagePath, 180, doc.y - 240, {
      fit: [200, 200],
      align: "center",
      valign: "center",
    });

    // Move cursor below the QR code
    doc.moveDown(14);

    // Footer Section
    doc.fontSize(10).fillColor("#666666").text("Please keep this document secure as it contains your unique identifier for mess attendance.", {
      align: "center",
    });
    doc.moveDown();
    doc.fontSize(10).fillColor("#666666").text("For support, contact: support@iitjmessportal.edu", {
      align: "center",
    });

    // Finalize PDF file
    doc.end();
  });

  // Clean up the temporary QR image
  fs.unlinkSync(qrCodeImagePath);

  return pdfBuffer;
}

export default generateQRCodePDF;
