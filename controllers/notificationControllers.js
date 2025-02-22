import Notification from "../models/notification.js";
import { handleError, handleSuccess } from "../utils/responses.js";

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    return handleSuccess(
      res,
      "Notifications fetched successfully",
      notifications
    );
  } catch (error) {
    console.log(error); 
    return handleError(
      res,
      error,
      "An error occurred while fetching notifications"
    );
  }
};

export const readNotification = async (req, res) => {
  const { id: notificationId } = req.params;
  try {
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return handleError(res, "Notification not found", 404);
    }

    notification.isRead = true;
    await notification.save();

    return handleSuccess(res, "Notification updated successfully", notification);
  }
  catch (error) {
    handleError(res, error, "An error occred while opening this notification")
  }
}
