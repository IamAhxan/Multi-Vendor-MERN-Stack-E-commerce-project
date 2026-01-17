import ErrorHandler from "../utils/ErrorHandler.js";
import catchAsyncErrors from "./catchAsyncError.js"
import jwt from "jsonwebtoken"
import User from '../model/user.model.js'


export const isAuthenticated = catchAsyncErrors(async (req, resizeBy, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    req.user = await User.findById(decoded.id)
})