import express from "express";
const router = express.Router();
import Event from "../model/event.model.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Shop from "../model/shop.model.js";
import { upload } from "../multer.js";



// Create Event
router.post("/create-event", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId)

        if (!shop) {
            return next(new ErrorHandler("Shop id is invalid", 400))
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`);
            const eventData = req.body;
            eventData.images = imageUrls;
            eventData.shop = shop;

            const event = await Event.create(eventData);

            res.status(201).json({
                success: true,
                event
            })
        }

    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))


export default router