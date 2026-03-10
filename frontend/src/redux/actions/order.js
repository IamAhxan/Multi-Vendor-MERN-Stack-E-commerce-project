import axios from "axios";
import { server } from "../../server";

// Get all orders of a user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
    try {
        dispatch({ type: "getAllOrdersUserRequest" });

        const { data } = await axios.get(
            `${server}/order/get-all-orders/${userId}`,
            {
                withCredentials: true,
            },
        );
        dispatch({
            type: "getAllOrdersUserSuccess",
            payload: data.orders,
        });
    } catch (error) {
        dispatch({
            type: "getAllOrdersUserFailed",
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};

// get all orders of a seller
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
    try {
        dispatch({ type: "getAllOrdersOfShopRequest" });
        const { data } = await axios.get(
            `${server}/order/get-seller-all-orders/${shopId}`,
            { withCredentials: true },
        );
        dispatch({ type: "getAllOrdersOfShopSuccess", payload: data.orders });
    } catch (error) {
        dispatch({
            type: "getAllOrdersOfShopFailed",
            payload: error.response?.data?.message || "Something went wrong",
        });
    }
};
