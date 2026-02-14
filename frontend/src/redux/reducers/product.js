import { createReducer } from '@reduxjs/toolkit'

const initialState = {
    isLoading: true,
    products: [],
    allProducts: [],
}

export const productReducer = createReducer(initialState, (builder) => {
    builder
        .addCase('productCreateRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('productCreateSuccess', (state, action) => {
            state.isLoading = false;
            state.products = action.payload;
            state.success = true;
        })
        .addCase('productCreateFail', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = false;
        })
        .addCase('getAllProductsShopRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllProductsShopSuccess', (state, action) => {
            state.isLoading = false;
            // CHANGE THIS: Keep shop-specific products here
            state.products = action.payload;
        })
        .addCase('getAllProductsShopFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })
        .addCase('deleteProductRequest', (state) => {
            state.isLoading = true
        })
        .addCase('deleteProductSuccess', (state, action) => {
            state.isLoading = false
            state.message = action.payload
        })
        .addCase('deleteProductFailed', (state, action) => {
            state.isLoading = false
            state.error = action.payload
        })
        .addCase('clearErrors', (state) => {
            state.error = null;
        })
        .addCase('getAllProductsRequest', (state) => {
            state.isLoading = true;
        })
        .addCase('getAllProductsSuccess', (state, action) => {
            state.isLoading = false;
            // CHANGE THIS: Keep global products here for Best Deals/Featured
            state.allProducts = action.payload;
        })
        .addCase('getAllProductsFailed', (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        })

});