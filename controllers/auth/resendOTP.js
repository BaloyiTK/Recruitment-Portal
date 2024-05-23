import asyncHandler from "express-async-handler";
import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

const resendOTP = asyncHandler(async (req, res) => {
    try {
        // Ensure the client is connected before attempting to use it
        if (client.connected) {
            // Retrieve the userId from Redis
            client.get('userId', (err, userId) => {
                if (err) {
                    console.error('Error retrieving userId from Redis:', err);
                    res.status(500).json({ success: false, message: "Internal server error" });
                    return;
                }

                if (userId) {
                    console.log('UserId retrieved from Redis:', userId);
                    // Here you can use the userId as needed
                    res.status(200).json({ userId });
                } else {
                    console.log('UserId not found in Redis');
                    res.status(404).json({ success: false, message: "UserId not found" });
                }
            });
        } else {
            // If the client is not connected, handle the error appropriately
            throw new Error('Redis client is not connected');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default resendOTP;
