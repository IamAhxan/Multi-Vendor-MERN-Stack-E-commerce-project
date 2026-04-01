import express from "express";
const router = express.Router();
import Product from "../model/product.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Shop from "../model/shop.model.js";
import { upload } from "../multer.js";
import { isAuthenticated, isSeller } from "../middleware/auth.js";

// Create Product

router.post(
  "/create-product",
  upload.array("images"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return next(new ErrorHandler("Shop id is invalid", 400));
      } else {
        const files = req.files;
        const imageUrls = files.map((file) => file.path); // Cloudinary HTTPS URLs
        const productData = req.body;
        productData.images = imageUrls;
        productData.shop = shop;

        const product = await Product.create(productData);

        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }),
);

// Get all products of a shop

router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  }),
);

// Delete Product of a shop

router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const productData = await Product.findById(productId);
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product Not Found with this id", 500));
      }

      res.status(200).json({
        success: true,
        message: "Product Deleted Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }),
);
// Get all products (Global)
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Find all products and sort by creation date (newest first)
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// Reviews for a product

router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);
      const review = {
        user,
        rating,
        comment,
        productId,
      };

      if (!product) {
        return next(new ErrorHandler("Product not found", 404));
      }

      const isReviews = product.reviews.find(
        (rev) => rev.user._id === user._id,
      );

      if (isReviews) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            ((rev.rating = rating), (rev.comment = comment), (rev.user = user));
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg = +rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.${elem}.isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }] },
      );

      res.status(200).json({
        success: true,
        message: "Review Added Successfully",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

export default router;
