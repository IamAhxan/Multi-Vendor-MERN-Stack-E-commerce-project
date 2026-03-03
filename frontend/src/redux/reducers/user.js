import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
    addressLoading: false,
    updateAddressSuccessMessage: "",
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
        .addCase("LoadUserRequest", (state) => {
            state.loading = true;
        })
        .addCase("LoadUserSuccess", (state, action) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
        })
        .addCase("LoadUserFail", (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
        .addCase("updateUserInfoRequest", (state) => {
            state.loading = true;
        })
        .addCase("updateUserInfoSuccess", (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase("updateUserInfoFailed", (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase("updateUserAddressRequest", (state) => {
            state.addressLoading = true
        })
        .addCase("updateUserAddressSuccess", (state, action) => {
            state.addressLoading = false,
                state.successMessage = action.payload.successMessage
            state.user = action.payload.user
        })
        .addCase("updateUserAddressFailed", (state, action) => {
            state.addressLoading = false,
                state.error = action.payload
        })

        // delete user Address
        .addCase("deleteUserAddressRequest", (state) => {
            state.addressLoading = true
        })
        .addCase("deleteUserAddressSuccess", (state, action) => {
            state.addressLoading = false,
                state.user = action.payload.user,
                state.successMessage = action.payload.successMessage

        })
        .addCase("deleteUserAddressFailed", (state, action) => {
            state.addressLoading = false,
                state.error = action.payload
        })
        .addCase("clearErrors", (state) => {
            state.error = null;
        })
        .addCase("clearMessages", (state) => {
            state.updateAddressSuccessMessage = null

        })
})
