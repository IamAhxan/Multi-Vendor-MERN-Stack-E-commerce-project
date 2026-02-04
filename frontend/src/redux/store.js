import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user.js";
import { sellerReducer } from "./reducers/seller.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        seller: sellerReducer,
    },
});

export default store;
