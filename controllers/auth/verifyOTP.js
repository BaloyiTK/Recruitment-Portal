import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import { generateAuthToken } from "../../utils/generateAuthToken.js";
import setAuthCookie from "../../utils/setAuthCookie.js";
import Memcached from "memcached"; // Import Memcached library

// Create a Memcached client instance
const memcached = new Memcached('localhost:11211');

const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;

    // Check if user exists in cache
    memcached.get(otp, async (err, cachedUser) => {
      if (err) {
        console.error(err);
        // If there's an error with cache, proceed without caching
      }

      if (cachedUser) {
        // If user is found in cache, use cached data
        const token = generateAuthToken(cachedUser);
        setAuthCookie(res, token);
        return res.status(200).json({ message: "Email verified successfully" });
      }

      // If user is not found in cache, fetch from the database
      const user = await User.findOne({ "otp.code": otp });

      if (!user) {
        return res.status(404).json({ message: "Invalid OTP" });
      }

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

      // Store user data in cache with the OTP as key
      memcached.set( user, 3600, (cacheErr) => {
        if (cacheErr) {
          console.error(cacheErr);
          // If there's an error caching, proceed without caching
        }
      });

      const token = generateAuthToken(user);
      setAuthCookie(res, token);
      res.status(200).json({ message: "Email verified successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default verifyOTP;
