import Conversation from "../model/conversation.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import express from "express";
import { isSeller } from "../middleware/auth.js";
const router = express.Router();

// Create a new Conversation
router.post(
    "/create-new-conversation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { groupTitle, userId, sellerId } = req.body;

            const isConversationExist = await Conversation.findOne({ groupTitle });
            if (isConversationExist) {
                const conversation = isConversationExist;
                return res.status(200).json({
                    success: true,
                    message: "Conversation already exists",
                    conversation,
                });
            } else {
                const conversation = await Conversation.create({
                    members: [userId, sellerId],
                    groupTitle: groupTitle,
                });

                res.status(201).json({
                    success: true,
                    message: "Conversation created successfully",
                    conversation,
                });
            }
        } catch (error) {
            return next(new ErrorHandler(error.response.message, 500));
        }
    }),
);

// Get Seller Conversations

router.get(
    "/get-all-conversation-seller/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const conversations = await Conversation.find({
                members: { $in: [req.params.id] },
            }).sort({ updatedAt: -1, createdAt: -1 });

            res.status(201).json({
                success: true,
                conversations,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

//  Upadte the las conversation message
router.put(
    "/update-last-message/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { lastMessage, lastMessageId } = req.body;
            const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
                lastMessage,
                lastMessageId,
            });

            res.status(201).json({
                success: true,
                conversation,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

export default router;
