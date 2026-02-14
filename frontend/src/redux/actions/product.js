import axios from "axios";
import { server } from "../../server";

// Create product
export const createProduct = (newForm) => async (dispatch) => {
    try {
        dispatch({
            type: "productCreateRequest"
        });
        const config = { headers: { "Content-Type": "multipart/form-data" } }; // Fixed typo 'formData' to 'form-data'
        const { data } = await axios.post(`${server}/product/create-product`,
            newForm,
            config
        );

        dispatch({
            type: "productCreateSuccess",
            payload: data.product,
        });

    } catch (error) {
        dispatch({
            type: "productCreateFail",
            payload: error.response?.data?.message || "Something went wrong" // Added 's' to response and safety check
        });
    }
};

// Get all products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "getAllProductsShopRequest",
        });
        const { data } = await axios.get(`${server}/product/get-all-products-shop/${id}`);
        dispatch({
            type: "getAllProductsShopSuccess",
            payload: data.products
        });
    } catch (error) {
        dispatch({
            type: "getAllProductsShopFailed",
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Delete Product of a Shop
export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteProductRequest",
        });

        const { data } = await axios.delete(`${server}/product/delete-shop-product/${id}`, {
            withCredentials: true
        });

        dispatch({
            type: "deleteProductSuccess",
            payload: data.message
        });

    } catch (error) {
        dispatch({
            type: "deleteProductFailed",
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// Get all products (Site-wide)
export const getAllProducts = () => async (dispatch) => {
    try {
        dispatch({
            type: "getAllProductsRequest",
        });

        const { data } = await axios.get(`${server}/product/get-all-products`);

        dispatch({
            type: "getAllProductsSuccess",
            payload: data.products,
        });
    } catch (error) {
        dispatch({
            type: "getAllProductsFailed",
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};