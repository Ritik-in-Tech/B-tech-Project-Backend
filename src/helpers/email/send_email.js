// src/helpers/email/send_email.js

import nodemailer from 'nodemailer';

/**
 * Sends an email with the given options.
 * @param {Object} mailOptions - The email options.
 * @returns {Promise<void>}
 */
const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
    port: parseInt(process.env.EMAIL_PORT, 10), // e.g., 587
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send email.');
  }
};

export {sendEmail};
