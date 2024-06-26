// otpController.js
import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import { generateAuthToken } from "../../utils/generateAuthToken.js";
import setAuthCookie from "../../utils/setAuthCookie.js";
import generateOTP from "../../utils/generateOTP.js";
import sendRegistrationVerificationEmail from "../../services/communication/sendRegistrationVerificationEmail.js";
import { passwordHash } from "../../utils/passwordHash.js";
import redis from "redis";

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

client.connect(console.log("Connected to Redis"));

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

    const userId = user.id.toString();

    await client.set("id", userId);

    const value = await client.get("id");
    console.log(value);

    const otpExpiration = user.otp.expires;
    const currentTime = new Date();

    console.log(currentTime > otpExpiration);

    if (currentTime > otpExpiration) {
      user.otp = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired" });
    }

    user.isEmailVerified = true;
    user.otp = null;
    await user.save();

    const token = generateAuthToken(user);
    setAuthCookie(res, token);

    res.status(200).json({ message: "Email verified successfully" });
    sendRegistrationVerificationEmail(user.email, null, "verified")
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const resendOTP = asyncHandler(async (req, res) => {
  try {
    const id = await client.get("id");

    if (!id) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    const user = await User.findById(id).select("-password");

    if (user.isEmailVerified) {
      user.otp = null;
      return res.status(404).json({ message: "User already verified, please login" });
    }

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const recipientEmail = user.email;
    const otp = generateOTP();

    const otpExpiration = new Date(Date.now() + 1 * 60 * 1000); // Expiration time: 5 minutes from now

    user.otp.code = otp;

    user.otp.expires = otpExpiration;

    await user.save();

    await sendRegistrationVerificationEmail(recipientEmail, otp);


    res.status(200).json({ message: "OTP resent successfully" });
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

const registerUser = async (username, email, accountType,  password) => {

  console.log(accountType)
  const hashedPassword = await passwordHash(password);

  const otp = generateOTP(); // Generate OTP
  const otpExpiration = new Date(Date.now() + 1 * 60 * 1000); // Expiration time: 30 minutes from now

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
    client.setEx("id", 1000, userId);
  }

  await sendRegistrationVerificationEmail(email, otp, null); // Send OTP via email
};

export { verifyOTP, resendOTP, registerUser };
