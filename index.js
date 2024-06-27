import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import errorHandler from "./middleswares/errorMiddleware.js";


dotenv.config();

const app = express();

const uri = process.env.DATABASE_URI;
const PORT = process.env.PORT;

app.use(
  express.json(), // Middleware to parse JSON request bodies
  cors({
    credentials: true,
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
  cookieParser()
);

app.use(cookieParser());

// Simple test route
app.get("/", (req, res) => {
  res.send("Welcome to the recruitment portal!");
});

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", jobRouter);
app.use("/", applicationRouter);

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connected successfully");
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

app.use(errorHandler);
