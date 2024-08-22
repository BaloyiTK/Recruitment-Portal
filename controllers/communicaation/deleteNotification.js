import asyncHandler from "express-async-handler";
import Notification from "../../models/notification.js";

const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const { notificationId } = req.params; // Get the notification ID from the request parameters
    //const userId = req.user.userId; // Get the user ID from the authenticated user

    // Find and delete the notification if it belongs to the authenticated user
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found or unauthorized to delete" });
    }

 

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
});

export default deleteNotification;
