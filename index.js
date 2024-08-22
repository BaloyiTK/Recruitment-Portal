import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import errorHandler from "./middleswares/errorMiddleware.js";
import axios from "axios";
import logRequestResponse from "./middleswares/logRequestResponse.js";
import logError from "./middleswares/logError.js";


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

app.use(logRequestResponse);

// Routes
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get("/api/zoom-auth", (req, res) => {
  const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  return res.redirect(encodeURI(authorizationUrl));
});

app.get("/api/callback", async (req, res) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send("Authorization code is required");
  }

  try {
    const tokenResponse = await axios.post(
      "https://zoom.us/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: REDIRECT_URI,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Store access token and redirect to the app
    res.redirect(`/dashboard?access_token=${accessToken}`);
  } catch (error) {
    console.error("Error handling request:", error.message);
    res.status(500).send("Error processing OAuth callback");
  }
});
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", jobRouter);
app.use("/", applicationRouter);
app.use("/", notificationRouter);

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

app.use(logError);
app.use(errorHandler);
