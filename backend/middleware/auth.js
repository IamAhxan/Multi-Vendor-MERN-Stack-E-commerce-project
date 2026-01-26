import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncError.js"
import jwt from "jsonwebtoken"
import User from '../model/user.model.js'

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;

    // 1. Check if token exists
    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3. Find user and attach to request
    // Use decoded.id (ensure this matches what you saved in jwtToken.js)
    req.user = await User.findById(decoded.id);

    // 4. CRITICAL: Move to the next middleware/controller
    next();
});