import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello BTP Project");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
