import asyncHandler from "express-async-handler";
import redis from "redis";

// Create a Redis client
const redisClient = redis.createClient();

// Log any Redis errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const resendOTP = asyncHandler(async (req, res) => {
  try {

    // Retrieve user ID from Redis
    redisClient.get(`user`, (err, reply) => {
      if (err) {
        console.error('Error retrieving user ID from Redis:', err);
        return res.status(500).json({ success: false, message: "Error retrieving user ID from Redis" });
      }

      if (!reply) {
        return res.status(404).json({ message: "User ID not found in Redis" });
      }

      // User ID found in Redis
      const storedUserId = reply.toString();
      console.log('Retrieved user ID from Redis:', storedUserId);

      // Now you can use the storedUserId as needed

      // Perform the resend OTP logic here

      res.send("resend");
    });
  } catch (error) {
    // Log error and send internal server error response
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default resendOTP;
