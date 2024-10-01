import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";

export let dbInstance = undefined;
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@software1.gptczdh.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=software1`
    );
    dbInstance = connectionInstance;
    console.log(
      `\n☘️  MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export { connectDB };
