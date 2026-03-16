import Conversation from "../model/conversation.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import express from "express";
import Messages from "../model/messages.model.js";
import { upload } from "../multer.js";
const router = express.Router();

// Create a new Message
router.post(
    "/create-new-message",
    upload.array("images"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const messageData = req.body;
            if (req.files) {
                const files = req.files;
                const imageUrls = files.map((file) => `${file.fileName}`);

                messageData.images = imageUrls;
            }

            messageData.conversationId = messageData.conversationId;
            messageData.sender = req.body.sender;

            const message = new Messages({
                conversationId: messageData.conversationId,
                sender: messageData.sender,
                text: messageData.text,
                images: messageData.images ? messageData.images : undefined,

            });

            await message.save();

            res.status(201).json({
                success: true,
                message,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

export default router;
