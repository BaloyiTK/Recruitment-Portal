import asyncHandler from "express-async-handler";
import Memcached from "memcached";

// Create a Memcached client instance
const memcached = new Memcached('localhost:11211');

const resendOTP = asyncHandler(async (req, res) => {
  try {
    // Assuming you have the OTP value in req.body
    const { otp } = req.body;

    // Check if user exists in cache
    memcached.get(otp, async (err, cachedUser) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }

      if (cachedUser) {
        // If user is found in cache, use cached data
        res.status(200).json({ user: cachedUser });
      } else {
        // If user is not found in cache, handle accordingly
        res.status(404).json({ message: "User not found in cache" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default resendOTP;
