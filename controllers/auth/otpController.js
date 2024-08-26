import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import { generateAuthToken } from "../../utils/generateAuthToken.js";
import setAuthCookie from "../../utils/setAuthCookie.js";
import generateOTP from "../../utils/generateOTP.js";
import sendRegistrationVerificationEmail from "../../services/communication/sendRegistrationVerificationEmail.js";
import { passwordHash } from "../../utils/passwordHash.js";
import redis from "redis";
import Profile from "../../models/profile.js";

// Initialize Redis client
const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.connect().then(() => {
  console.log("Connected to Redis");
}).catch(err => {
  console.error('Redis connection error:', err);
});

const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "Please enter OTP" });
    }

    const user = await User.findOne({ "otp.code": otp });

    if (!user) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    const currentTime = new Date();

    if (currentTime > user.otp.expires) {
      user.otp = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isEmailVerified = true;
    user.otp = null;
    await user.save();

    const token = generateAuthToken(user);
    setAuthCookie(res, token);

    await sendRegistrationVerificationEmail(user.email, null, "verified");

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const resendOTP = asyncHandler(async (req, res) => {
  try {
    const id = await client.get("id");

    if (!id) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      user.otp = null;
      return res.status(400).json({ message: "User already verified, please login" });
    }

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    user.otp = {
      code: otp,
      expires: otpExpiration,
    };

    await user.save();
    await sendRegistrationVerificationEmail(user.email, otp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error in resendOTP:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const registerUser = asyncHandler(async (username, email, accountType, password) => {
  try {
    const hashedPassword = await passwordHash(password);
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    const user = await User.create({
      username,
      email,
      accountType,
      password: hashedPassword,
      otp: {
        code: otp,
        expires: otpExpiration,
      },
    });

    const userId = user.id.toString();

    if (client.isReady) {
      await client.setEx("id", 3600, userId); // Set expiration to 1 hour
    }

    await sendRegistrationVerificationEmail(email, otp);

    return user;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw new Error("Registration failed");
  }
});

const createProfile = asyncHandler(async (req, res) => {
  try {
    const userId = await client.get("id");

    if (!userId) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if profile already exists for the user
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    // Create and save the new profile
    const newProfile = new Profile({
      user: userId,
      email: user.email,
    });

    await newProfile.save();

    res.status(201).json({ message: "Profile created successfully" });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export { verifyOTP, resendOTP, registerUser, createProfile };
