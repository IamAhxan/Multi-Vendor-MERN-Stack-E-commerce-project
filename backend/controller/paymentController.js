import express from "express";
const router = express.Router();
import Stripe from "stripe";
import catchAsyncErrors from "../middleware/catchAsyncError.js";

router.post(
    "/payment/process",
    catchAsyncErrors(async (req, res, next) => {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "usd",
            metadata: {
                company: "Techwebix",
            },
        });
        res.status(201).json({
            success: true,
            client_secret: myPayment.client_secret,
        });
    }),
);

router.get(
    "/stripeapikey",
    catchAsyncErrors(async (req, res, next) => {
        res.status(200).json({ stripeapikey: process.env.STRIPE_API_KEY });
    }),
);


export default router