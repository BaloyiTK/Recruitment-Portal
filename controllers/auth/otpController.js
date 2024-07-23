// otpController.js
import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import { generateAuthToken } from "../../utils/generateAuthToken.js";
import setAuthCookie from "../../utils/setAuthCookie.js";
import generateOTP from "../../utils/generateOTP.js";
import sendRegistrationVerificationEmail from "../../services/communication/sendRegistrationVerificationEmail.js";
import { passwordHash } from "../../utils/passwordHash.js";
import redis from "redis";
import Profile from "../../models/profile.js";


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
 

    const otpExpiration = user.otp.expires;
    const currentTime = new Date();



    //  if (currentTime > otpExpiration) {
    //   user.otp = null;
    //    await user.save();
    //    return res.status(400).json({ message: "OTP has expired" });
    //  }

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

    const otpExpiration = new Date(Date.now() + 30 * 60 * 1000); 

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

 
  const hashedPassword = await passwordHash(password);

  const otp = generateOTP(); // Generate OTP
  const otpExpiration = new Date(Date.now() + 30 * 60 * 1000); 

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

  createProfile()


  await sendRegistrationVerificationEmail(email, otp, null); // Send OTP via email
};


const createProfile = asyncHandler(async (req, res) => {
  try {
    const userId = await client.get("id");

    const user = await User.findById(userId);

    // Check if profile already exists for the user
    const profile = await Profile.findOne({ user: userId });
    if (profile) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    // Destructure profile details from the request body
    const { email } = user;

    const newProfile = new Profile({
      user: userId,
      email,
    });

    // Save the new profile to the database
    await newProfile.save();

    // Send the newly created profile as a response
    //res.status(201).json(newProfile);
  } catch (error) {
    // If an error occurs during profile creation, handle it and send an error response
    console.error("Error creating profile:", error);
   // res.status(500).json({ message: "Internal Server Error" });
  }
});



export { verifyOTP, resendOTP, registerUser, createProfile }
