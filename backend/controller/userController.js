import express from "express";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "./../middleware/auth.js";
import User from "../model/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { upload } from "../multer.js";
import catchAsyncErrors from "../middleware/catchAsyncError.js";
import sendToken from "../utils/jwtToken.js";
import sendMail from "../utils/sendMail.js";

const router = express.Router();

/* ==================================================
   CREATE USER (SEND ACTIVATION EMAIL)
================================================== */
router.post(
    "/create-user",
    upload.single("file"),
    catchAsyncErrors(async (req, res, next) => {
        const { name, email, password } = req.body;
        console.log("DEBUG: create-user hit");
        console.log("DEBUG: SMTP_MAIL is:", process.env.SMTP_MAIL);


        try {
            /* ---------- FILE CHECK ---------- */
            if (!req.file) {
                console.error("Avatar missing");
                return next(new ErrorHandler("Avatar is required", 400));
            }

            /* ---------- DUPLICATE USER CHECK ---------- */
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return next(new ErrorHandler("User already exists", 400));
            }

            /* ---------- PREPARE USER DATA ---------- */
            const userData = {
                name,
                email,
                password,
                avatar: req.file.path, // Cloudinary URL
            };

            /* ---------- CREATE TOKEN ---------- */
            let activationToken;
            try {
                activationToken = createActivationToken(userData);
            } catch (error) {
                console.error("JWT creation failed:", error.message);
                return next(new ErrorHandler("Token generation failed", 500));
            }

            const activationUrl = `https://multi-vendor-mern-stack-frontend.vercel.app/activation/${activationToken}`;

            /* ---------- SEND MAIL ---------- */
            try {
                await sendMail({
                    email,
                    subject: "Activate your account",
                    message: `Hello ${name},\n\nPlease click the link below to activate your account:\n${activationUrl}`,
                });
            } catch (error) {
                console.error("Email sending failed:", error.message);
                return next(new ErrorHandler(`Failed to send activation email: ${error.message}`, 500));
            }

            /* ---------- SUCCESS RESPONSE ---------- */
            res.status(201).json({
                success: true,
                message: `Please check your email ${email} to activate your account`,
            });
        } catch (error) {
            console.error("Unexpected create-user error:", error);
            return next(new ErrorHandler("Internal server error", 500));
        }
    }),
);

/* ==================================================
   ACTIVATE USER
================================================== */
router.post(
    "/activation",
    catchAsyncErrors(async (req, res, next) => {
        const { activation_token } = req.body;

        try {
            if (!activation_token) {
                console.error("Activation token missing");
                return next(new ErrorHandler("Activation token is required", 400));
            }

            let userData;
            try {
                userData = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);
            } catch (error) {
                console.error("JWT verification failed:", error.message);
                return next(new ErrorHandler("Invalid or expired token", 400));
            }

            /* ---------- CHECK EXISTING USER ---------- */
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                console.warn("User already activated:", userData.email);
                return next(new ErrorHandler("User already activated", 400));
            }

            /* ---------- CREATE USER ---------- */
            let user;
            try {
                user = await User.create(userData);
            } catch (error) {
                console.error("User creation failed:", error.message);
                return next(new ErrorHandler("User activation failed", 500));
            }

            sendToken(user, 201, res);
        } catch (error) {
            console.error("Unexpected activation error:", error);
            next(new ErrorHandler(error.message, 500));
        }
    }),
);

/* ==================================================
   CREATE ACTIVATION TOKEN
================================================== */
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

// Login User

router.post(
    "/login-user",
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new ErrorHandler("Please provide all credentials", 400));
            }

            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                return next(new ErrorHandler("User Does not exist!", 404));
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return next(new ErrorHandler("Incorrect Password", 400));
            }

            sendToken(user, 201, res);
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// Load User

router.get(
    "/getuser",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id);

            if (!user) {
                return next(new ErrorHandler("User does not exist", 400));
            }

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

router.get(
    "/logout",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                secure: process.env.NODE_ENV === 'production',
            });
            res.status(201).json({
                success: true,
                message: "Logout successfully",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// Update User

router.put(
    "/update-user-info",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const { email, password, phoneNumber, name } = req.body;
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                return next(new ErrorHandler("User not found", 404));
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return next(
                    new ErrorHandler("Please provide correct information", 400),
                );
            }

            user.name = name;
            user.email = email;
            user.phoneNumber = phoneNumber;
            await user.save();

            res.status(201).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// update user avatar
router.put(
    "/update-avatar",
    isAuthenticated,
    upload.single("image"),
    catchAsyncErrors(async (req, res, next) => {
        try {
            // Old avatar is on Cloudinary — no local file deletion needed
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { avatar: req.file.path }, // Cloudinary URL
                { new: true },
            );

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// Update User Addresses

router.put(
    "/update-user-addresses",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            const sameTypeAddress = user.addresses.find(
                (address) => address.addressType === req.body.addressType,
            );

            if (sameTypeAddress) {
                return next(
                    new ErrorHandler(`${req.body.addressType} address already exists `),
                );
            }

            const existAddress = user.addresses.find(
                (address) => address._id === req.body._id,
            );
            if (existAddress) {
                Object.assign(existAddress, req.body);
            } else {
                // add new addres to aray
                user.addresses.push(req.body);
            }
            await user.save();

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);

// Delete User Address

router.delete(
    "/delete-user-address/:id",
    isAuthenticated,
    catchAsyncErrors(async (req, res, next) => {
        try {
            const userId = req.user._id;
            const addressId = req.params.id;

            await User.updateOne(
                { _id: userId },
                { $pull: { addresses: { _id: addressId } } },
            );

            const user = await User.findById(userId);

            res.status(200).json({
                success: true,
                user,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    }),
);
// Update Password


router.put("/update-user-password", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("+password")

        const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400));

        }
        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHandler("New Password and confirm does not match each other", 400));

        }

        user.password = req.body.newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));

    }
}));



// find user information with userId
router.get("/user-info/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));

    }
}))
export default router;
