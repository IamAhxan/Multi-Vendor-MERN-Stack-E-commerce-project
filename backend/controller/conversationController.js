import Conversation from "../model/conversation.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import express from "express";
const router = express.Router()



// Create a new Conversation
router.post("/create-new-conversation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { groupTitle, userId, sellerId } = req.body;

        const isConversationExist = await Conversation.findOne({ groupTitle });
        if (isConversationExist) {
            const conversation = isConversationExist;
            return res.status(200).json({
                success: true,
                message: "Conversation already exists",
                conversation,
            })
        } else {
            const conversation = await Conversation.create({
                members: [userId, sellerId],
                groupTitle: groupTitle,
            })


            res.status(201).json({
                success: true,
                message: "Conversation created successfully",
                conversation,
            })
        }



    } catch (error) {
        return next(new ErrorHandler(error.response.message, 500));
    }
}))


// Get User Conversations


export default router;