import Message from "../models/message.js";
import { handleError, handleSuccess } from "../utils/responses.js";

export const getMessageHistory = async (req, res) => {
  const userId = req.user.id;
  const { recipientId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: recipientId },
        { sender: recipientId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    handleSuccess(res, "Messages fetched successfully", messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    handleError(res, error, "Failed to fetch chat history");
  }
};
