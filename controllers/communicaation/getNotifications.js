import asyncHandler from "express-async-handler";
import Notification from "../../models/notification.js";

// Async handler to handle the get notifications functionality
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  console.log("userID", userId);

  try {
    // Fetch notifications based on the userId
    const notifications = await Notification.find({ userId });

    console.log(notifications);

    // Send the notifications as a response
    res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

// Export the getNotifications function
export default getNotifications;
