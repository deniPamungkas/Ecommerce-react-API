import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";

const app = express();
dotenv.config();

app.listen(5000, () => {
  console.log("connected to server");
});

mongoose
  .connect(process.env.DATABASE_URL, { dbName: process.env.DBNAME })
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("failed to connect database");
  });

app.use(express.json());
app.use(
  cors({
    origin: "https://furnirodenipamungkas.vercel.app",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/cart", cartRouter);
