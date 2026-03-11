import express from "express";
const router = express.Router();
import Order from "./../model/order.model.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Product from "../model/product.js";
import { isAuthenticated, isSeller } from "./../middleware/auth.js";

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
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// Get Orders of a User
router.get(
    "/get-all-orders/:userId",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const orders = await Order.find({ "user._id": req.params.userId }).sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                orders,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// get all orders of a seller
router.get(
    "/get-seller-all-orders/:shopId",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const orders = await Order.find({
                "cart.shopId": req.params.shopId,
            }).sort({
                createdAt: -1,
            });

            res.status(200).json({
                success: true,
                orders,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// Update Order Status for seller

router.put(
    "/update-order-status/:id",
    isSeller,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return next(new ErrorHandler("Order not found", 404));
            }
            if (req.body.status === "Transferred to delivery partner") {
                order.cart.forEach(async (o) => {
                    await updateOrder(o._id, o.qty);
                });
            }

            order.Status = req.body.status;
            if (req.body.status === "Delivered") {
                order.deliveredAt = Date.now();
                order.paymentInfo.status = "Succeeded";
            }

            await order.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                order,
            });

            async function updateOrder(id, qty) {
                const product = await Product.findById(id);
                product.stock -= qty;
                product.sold_out += qty;
                await product.save({ validateBeforeSave: false });
            }
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// Give a Refund to user by seller

router.put(
    "/order-refund/:id",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return next(new ErrorHandler("Order not found", 404));
            }

            order.Status = req.body.status;

            await order.save({ validateBeforeSave: false });

            res.status(200).json({
                success: true,
                order,
                message: "Refund requested Successfully",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

export default router;
