import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user.js";

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;
