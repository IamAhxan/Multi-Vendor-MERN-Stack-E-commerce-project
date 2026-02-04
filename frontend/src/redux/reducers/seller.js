import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    seller: null,
    error: null,
};

export const sellerReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadSellerRequest", (state) => {
            state.isLoading = true;
        })
        .addCase("LoadSellerSuccess", (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.seller = action.payload;
        })
        .addCase("LoadSellerFail", (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        });
});

