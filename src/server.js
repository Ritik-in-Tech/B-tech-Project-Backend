import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";

dotenv.config();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

const HTTP_PORT = process.env.HTTP_PORT || 3000;

import { connectDB } from "./db/index.js";
import messRoutes from "./routes/mess.routes.js";
import userRoutes from "./routes/user.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/mess", messRoutes);

app.get("*", (req, res) => {
  res.json({ msg: "Welcome to BTP Restful API'S" });
});

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = http.createServer(app);

    httpServer.listen(HTTP_PORT, () => {
      console.log(`HTTP Server running on http://localhost:${HTTP_PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
