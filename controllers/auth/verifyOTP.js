import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import { generateAuthToken } from "../../utils/generateAuthToken.js";
import setAuthCookie from "../../utils/setAuthCookie.js";

import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();


const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "Please enter opt" });
    }

    // If user is not found in cache, fetch from the database
    const user = await User.findOne({ "otp.code": otp });

    if (!user) {
      return res.status(404).json({ message: "Invalid OTP" });
    }
    const userId = user.id.toString();


    await client.set('"userId"', userId);
    const value = await client.get('"userId"');
    console.log(value);



    const otpExpiration = user.otp.expires;
    const currentTime = new Date();

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default verifyOTP;
