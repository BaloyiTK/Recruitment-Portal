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
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    credentials: true,
    origin: true, // Set origin to true to allow all origins
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the recruitment portal!");
});

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", jobRouter);
app.use("/", applicationRouter);

// Connect to MongoDB
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

// Error Handler Middleware
app.use(errorHandler);
