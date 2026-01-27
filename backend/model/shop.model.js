import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your shop name!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your shop email!"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [4, "Password should be greater than 4 characters"],
        select: false,
    },
    description: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Seller",
    },// In your user.model.js
    avatar: {
        type: String,
        default: "", // Change it from an object to a simple String
    },
    zipCode: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,

});


//  Hash password
shopSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }


    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// jwt token
shopSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// compare password
shopSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;