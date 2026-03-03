import axios from "axios";
import { server } from "../../server";

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: "LoadUserRequest" });

        const { data } = await axios.get(`${server}/user/getuser`, {
            withCredentials: true,
        });

        dispatch({
            type: "LoadUserSuccess",
            payload: data.user,
        });
    } catch (error) {
        dispatch({
            type: "LoadUserFail",
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const loadSeller = () => async (dispatch) => {
    try {
        dispatch({ type: "LoadSellerRequest" });

        const { data } = await axios.get(`${server}/shop/getseller`, {
            withCredentials: true,
        });

        dispatch({
            type: "LoadSellerSuccess",
            payload: data.seller,
        });
    } catch (error) {
        dispatch({
            type: "LoadSellerFail",
            payload: error.response?.data?.message || error.message,
        });
    }
};

export const updateUserInformation =
    (email, password, phoneNumber, name) => async (dispatch) => {
        try {
            dispatch({
                type: "updateUserInfoRequest",
            });

            const { data } = await axios.put(
                `${server}/user/update-user-info`,
                {
                    email,
                    password,
                    phoneNumber,
                    name,
                },
                {
                    withCredentials: true,
                },
            );

            dispatch({
                type: "updateUserInfoSuccess",
                payload: data?.user,
            });
        } catch (error) {
            dispatch({
                type: "updateUserInfoFailed",
                payload: error.response.data?.message,
            });
        }
    };

// Update User Address

export const updateUserAddress =
    (country, city, address1, address2, addressType) => async (dispatch) => {
        try {
            dispatch({
                type: "updateUserAddressRequest",
            });

            const { data } = await axios.put(
                `${server}/user/update-user-addresses`,
                {
                    country,
                    city,
                    address1,
                    address2,
                    addressType,
                },
                { withCredentials: true },
            );

            dispatch({
                type: "updateUserAddressSuccess",
                payload: {
                    successMessage: "User address updated successfully",
                    user: data.user,
                },
            });
        } catch (error) {
            dispatch({
                type: "updateUserAddressFailed",
                payload: error.response.data?.message,
            });
        }
    };

// delete User Address

export const deleteUserAddress = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteUserAddressRequest"
        });

        const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, { withCredentials: true })

        dispatch({
            type: "deleteUserAddressSuccess",
            payload: {
                successMessage: "Address deleted successfully",
                user: data.user
            }
        })

    } catch (error) {
        dispatch({
            type: "deleteUserAddressFailed",
            payload: error.response.data?.message,
        });
    }
}
