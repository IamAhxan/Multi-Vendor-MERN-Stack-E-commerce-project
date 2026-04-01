import express from "express";
const router = express.Router();
import Event from "../model/event.model.js";
import Shop from "../model/shop.model.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { upload, uploadToCloudinary } from "../multer.js";
import { isSeller } from "../middleware/auth.js";

// Create Event
router.post("/create-event", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return next(new ErrorHandler("Shop id is invalid", 400));
        }

        const files = req.files;
        if (!files || files.length === 0) {
            return next(new ErrorHandler("Event images are required", 400));
        }

        // ✅ Upload all images to Cloudinary
        const imageUrls = await Promise.all(
            files.map((file) => uploadToCloudinary(file.buffer, "events"))
        );

        const eventData = req.body;
        eventData.images = imageUrls;
        eventData.shop = shop;

        const event = await Event.create(eventData);

        res.status(201).json({
            success: true,
            event
        });

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

// Get All events of a shop
router.get("/get-all-events-shop/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const events = await Event.find({ shopId: req.params.id });
        res.status(201).json({
            success: true,
            events
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

// Delete event of a shop
router.delete("/delete-shop-events/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.params.id;
        const event = await Event.findByIdAndDelete(productId);

        if (!event) {
            return next(new ErrorHandler("Event Not Found with this id", 500));
        }

        res.status(200).json({
            success: true,
            message: "Event Deleted Successfully"
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
}));

// Get All Events (Global)
router.get("/get-all-events", async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

export default router;