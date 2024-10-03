import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = process.env.ENCRYPTION_ALGORITHM;
if (!ENCRYPTION_KEY) {
  console.error("ENCRYPTION_KEY is not set in environment variables");
  process.exit(1);
}

const ENCRYPTION_KEY_BUFFER = Buffer.from(ENCRYPTION_KEY, "hex");

if (ENCRYPTION_KEY_BUFFER.length !== 32) {
  console.error("ENCRYPTION_KEY must be 32 bytes (64 hexadecimal characters)");
  process.exit(1);
}

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY_BUFFER, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};
