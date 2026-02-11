import mongoose from "mongoose";

const coupounCodeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Coupoun Code name!"],
        unique: true,
    },
    value: {
        type: Number,
    },
    minAmount: {
        type: Number,
    },
    maxAmount: {
        type: Number,
    },
    shop: {
        type: Object,
        required: true,
    },
    selectedProduct: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const CoupounCode = mongoose.model("CoupounCode", coupounCodeSchema);
export default CoupounCode;
