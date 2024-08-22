import asyncHandler from "express-async-handler";
import Notification from "../../models/notification.js";

// Async handler to handle the get notification by id functionality
const getNotificationById = asyncHandler(async (req, res) => {
  try {
    const { notificationId } = req.params; // Get the notification ID from the request parameters
    const userId = req.user.userId; // Get the user ID from the authenticated user

    // Find the notification by its ID
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Check if the notification belongs to the authenticated user
    if (notification.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to view this notification" });
    }

    // Mark the notification as read if it isn't already
    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    // Send the notification as a response
    res.status(200).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notification" });
  }
});

// Export the getNotificationById function
export default getNotificationById;
