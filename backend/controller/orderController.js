import express from "express";
const router = express.Router();
import Order from "./../model/order.model.js"
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Product from "../model/product.js";
import { isAuthenticated } from "./../middleware/auth.js";

// Create new Order
router.post(
    "/create-order",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

            //  Group cart Items by ShopId
            const shopItemsMap = new Map();
            for (const item of cart) {
                const shopId = item.shopId;
                if (!shopItemsMap.has(shopId)) {
                    shopItemsMap.set(shopId, []);
                }
                shopItemsMap.get(shopId).push(item);
            }
            // Create orders for each shop
            const orders = [];
            for (const [shopId, items] of shopItemsMap.entries()) {
                const order = await Order.create({
                    cart: items,
                    shippingAddress,
                    user,
                    totalPrice,
                    paymentInfo,
                });
                orders.push(order);
            }

            res.status(201).json({
                success: true,
                orders,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    }),
);

export default router;