// import express from "express";
// import path from "path";
// import fs from "fs";
// import { isAuthenticated } from "./../middleware/auth.js";
// import sendToken from "../utils/jwtToken.js";
// import sendMail from "../utils/sendMail.js";
// import jwt from "jsonwebtoken";
// import Shop from "../model/shop.model.js";
// import ErrorHandler from "../utils/ErrorHandler.js";
// import { upload } from "../multer.js"
// import catchAsyncErrors from "../middleware/catchAsyncError.js";

// const router = express.Router();

// router.post(
//     "/create-shop",
//     upload.single("file"),
//     catchAsyncErrors(async (req, res, next) => {
//         try {
//             const { email } = req.body;
//             const sellerEmail = await Shop.findOne({ email });
//             if (sellerEmail) {
//                 const filePath = `upload/${req.file.filename}`;

//                 fs.unlink(filePath, (err) => {
//                     if (err) {
//                         console.error("Error deleting file:", err.message);
//                     } else {
//                         console.log("File deleted successfully:", filePath);
//                     }
//                 });

//                 return next(new ErrorHandler("Seller already exists", 400));
//             }

//             const sellerData = {
//                 name: req.body.name,
//                 email: email,
//                 password: req.body.password,
//                 // avatar: path.join("upload", req.file.filename),
//                 avatar: req.file ? req.file.filename : "",
//                 address: req.body.address,
//                 phoneNumber: req.body.phoneNumber,
//                 zipCode: req.body.zipCode,
//             };

//             let activationToken;
//             try {
//                 activationToken = createActivationToken(sellerData);
//             } catch (error) {
//                 console.error("JWT creation failed:", error.message);
//                 return next(new ErrorHandler("Token generation failed", 500));
//             }

//             const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

//             /* ---------- SEND MAIL ---------- */
//             try {
//                 const name = sellerData.name
//                 await sendMail({
//                     email,
//                     subject: "Activate your account",
//                     message: `Hello ${name},\n\nPlease click the link below to activate your Shop:\n${activationUrl}`,
//                 });
//             } catch (error) {
//                 console.error("Email sending failed:", error.message);
//                 return next(new ErrorHandler("Failed to send activation email", 500));
//             }

//             // At the end of your /create-shop try block:
//             res.status(201).json({
//                 success: true,
//                 message: `please check your email:- ${sellerData.email} to activate your shop!`,
//             });
//         } catch (error) {
//             console.error("Unexpected create-user error:", error);
//             return next(new ErrorHandler(error.message, 500));
//         }

//     }),
// );

// /* ==================================================
//    CREATE ACTIVATION TOKEN
// ================================================== */
// const createActivationToken = (sellerData) => {
//     return jwt.sign(sellerData, process.env.ACTIVATION_SECRET, {
//         expiresIn: "5m",
//     });
// };

// /* ==================================================
//    ACTIVATE USER
// ================================================== */
// router.post(
//     "/activation",
//     catchAsyncErrors(async (req, res, next) => {
//         const { activation_token } = req.body;

//         if (!activation_token) {
//             // return next(new ErrorHandler("Activation token is required", 400));
//         }

//         // jwt.verify will throw an error if expired/invalid
//         // catchAsyncErrors will automatically catch that and send it to next()
//         const newSeller = jwt.verify(
//             activation_token,
//             process.env.ACTIVATION_SECRET
//         );

//         const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;

//         // Check if shop already exists
//         const existingShop = await Shop.findOne({ email });
//         if (existingShop) {
//             return next(new ErrorHandler("Shop already activated", 400));
//         }

//         // Create the shop
//         const seller = await Shop.create({
//             name,
//             email,
//             password,
//             avatar,
//             zipCode,
//             address,
//             phoneNumber,
//         });

//         sendToken(seller, 201, res);
//     })
// );


// export default router



import express from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import Shop from "../model/shop.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { upload } from "../multer.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import sendMail from "../utils/sendMail.js";
import sendShopToken from "../utils/shopToken.js";
import { isAuthenticated, isSeller } from './../middleware/auth.js'


const router = express.Router();

/**
 * Helper: Create Activation Token
 * Moved to top because arrow functions are not hoisted.
 */
const createActivationToken = (sellerData) => {
    return jwt.sign(sellerData, process.env.ACTIVATION_SECRET, {
        expiresIn: "10m",
    });
};

/**
 * Create Shop Route
 */
router.post(
    "/create-shop",
    upload.single("file"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { name, email, password, address, phoneNumber, zipCode } = req.body;

            // 1. Check if seller already exists
            const sellerEmail = await Shop.findOne({ email });
            if (sellerEmail) {
                // If there's an uploaded file, delete it before throwing error
                if (req.file) {
                    const filePath = path.join(process.cwd(), "upload", req.file.filename);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
                return next(new ErrorHandler("Seller already exists", 400));
            }

            // 2. Structure seller data
            const filename = req.file ? req.file.filename : "";
            const sellerData = {
                name,
                email,
                password, // Ensure your Shop model hashes this password in a .pre("save") hook
                avatar: filename,
                address,
                phoneNumber,
                zipCode,
            };

            // 3. Create activation token
            if (!process.env.ACTIVATION_SECRET) {
                return next(new ErrorHandler("Internal Server Error: Secret missing", 500));
            }
            const activationToken = createActivationToken(sellerData);

            // 4. Send Email
            const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;
            try {
                await sendMail({
                    email: sellerData.email,
                    subject: "Activate your Shop Account",
                    message: `Hello ${sellerData.name}, please click the link to activate your shop: ${activationUrl}`,
                });

                res.status(201).json({
                    success: true,
                    message: `Please check your email: ${sellerData.email} to activate your shop!`,
                });
            } catch (mailError) {
                return next(new ErrorHandler(mailError.message, 500));
            }
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }
    })
);

/**
 * Activate Shop Route
 */
// router.post(
//     "/activation/:activation_token",
//     catchAsyncErrors(async (req, res, next) => {
//         try {
//             const { activation_token } = req.params;

//             if (!activation_token) {
//                 return next(new ErrorHandler("Activation token is required", 400));
//             }
//             console.log("TOKEN RECEIVED:", activation_token);
//             console.log("SECRET:", process.env.ACTIVATION_SECRET);
//             const newSeller = jwt.verify(
//                 activation_token,
//                 process.env.ACTIVATION_SECRET
//             );

//             const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;

//             const existingShop = await Shop.findOne({ email });
//             if (existingShop) {
//                 return next(new ErrorHandler("Shop already activated", 400));
//             }

//             const seller = await Shop.create({
//                 name,
//                 email,
//                 password,
//                 avatar,
//                 address,
//                 phoneNumber: Number(phoneNumber),
//                 zipCode: Number(zipCode),
//             });

//             sendToken(seller, 201, res);
//         } catch (error) {
//             return next(new ErrorHandler("Token is invalid or expired!", 400));
//         }
//     })
// );
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { activation_token } = req.body;
            console.log(activation_token)
            const newSeller = jwt.verify(
                activation_token,
                process.env.ACTIVATION_SECRET
            );

            if (!newSeller) {
                return next(new ErrorHandler("Invalid token", 400));
            }
            const { name, email, password, avatar, zipCode, address, phoneNumber } =
                newSeller;
            console.log(name, email, password, avatar, zipCode, address, phoneNumber)

            let seller = await Shop.findOne({ email });

            if (seller) {
                next(new ErrorHandler("User already exists", 400));
            }
            seller = await Shop.create({
                name,
                email,
                avatar,
                password,
                address,
                phoneNumber: Number(phoneNumber),
                zipCode: Number(zipCode),
            });

            sendShopToken(seller, 201, res)

        } catch (error) {
            console.error("DETAILED ERROR:", error);
            return next(new ErrorHandler(error.message, 500));

        }
    })
);


// Shop Login

router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please provide all credentials", 400))
        }

        const seller = await Shop.findOne({ email }).select("+password");
        if (!seller) {
            return next(new ErrorHandler("User Does not exist!", 404))
        }

        const isPasswordValid = await seller.comparePassword(password);
        if (!isPasswordValid) {
            return next(new ErrorHandler("Incorrect Password", 400))
        }

        sendShopToken(seller, 201, res)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}))

// Load Shop Data
router.get("/getseller", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const seller = await Shop.findById(req.seller._id);

        if (!seller) {
            return next(new ErrorHandler("Seller does not exist", 400))
        }
        console.log(seller)
        res.status(200).json({
            success: true,
            seller
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}))


// Logout Shop
router.get("/logout", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        res.cookie("seller_token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        res.status(201).json({
            success: true,
            message: "Logout successfully"
        });


    } catch (error) {
        return next(new ErrorHandler(error.message, 500))

    }
}))

export default router;