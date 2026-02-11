import express from "express";
const router = express.Router();
import Shop from "../model/shop.model.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { isSeller } from "../middleware/auth.js";
import CoupounCode from "../model/coupounCode.model.js";

// Create coupoun Code

router.post("/create-coupon-code", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const isCoupounCodeExist = await CoupounCode.find({ name: req.body.name });
        if (isCoupounCodeExist.length !== 0) {
            return next(new ErrorHandler("Coupoun Code already exists!", 400))
        }

        const coupounCode = await CoupounCode.create(req.body)

        res.status(201).json({
            success: true,
            message: "Coupon Code Created Successfully",
            coupounCode
        })


    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))
export default router