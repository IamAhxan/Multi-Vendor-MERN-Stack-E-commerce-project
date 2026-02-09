import express from "express";
const router = express.Router();
import Product from "../model/product.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Shop from "../model/shop.model.js";
import { upload } from "../multer.js";


// Create Product

router.post("/create-product", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId)

        if (!shop) {
            return next(new ErrorHandler("Shop id is invalid", 400))
        } else {
            const files = req.files;
            const imageUrls = files.map((file) => `${file.filename}`);
            const productData = req.body;
            productData.images = imageUrls;
            productData.shop = shop;

            const product = await Product.create(productData);

            res.status(201).json({
                success: true,
                product
            })
        }

    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))


// Get all products of a shop

router.get("/get-all-products-shop/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find({ shopId: req.params.id });
        res.status(201).json({
            success: true,
            products
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}))

export default router