import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    isLoading: true,
    orders: [],
}

export const orderReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('getAllOrdersUserRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllOrdersUserSuccess', (state, action) => {
            state.isLoading = false;
            // CHANGE THIS: Keep shop-specific products here
            state.orders = action.payload;
        })
        .addCase('getAllOrdersUserFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        // get all orders of a seller
        .addCase('getAllOrdersOfShopRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllOrdersOfShopSuccess', (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
        })
        .addCase('getAllOrdersOfShopFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

        .addCase("clearErrors", (state) => {
            state.error = null;
        })
        .addCase("clearMessages", (state) => {
            state.updateAddressSuccessMessage = null

        })

});