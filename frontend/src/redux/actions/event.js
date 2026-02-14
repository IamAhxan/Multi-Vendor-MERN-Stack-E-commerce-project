import axios from "axios";
import { server } from "../../server";

// create event
export const createevent = (newForm) => async (dispatch) => {
    try {
        dispatch({ type: "eventCreateRequest" });

        const config = { headers: { "Content-Type": "multipart/form-data" } }; // Fixed: formData -> form-data
        const { data } = await axios.post(`${server}/event/create-event`, newForm, config);

        dispatch({
            type: "eventCreateSuccess",
            payload: data.event,
        });
    } catch (error) {
        dispatch({
            type: "eventCreateFail",
            // Fixed: respone -> response
            payload: error.response?.data?.message || "An error occurred",
        });
    }
};

// get all events of a shop
export const getAllEventsShop = (id) => async (dispatch) => {
    try {
        dispatch({ type: "getAllEventsShopRequest" });

        const { data } = await axios.get(`${server}/event/get-all-events-shop/${id}`);
        dispatch({
            type: "getAllEventsShopSuccess",
            payload: data.events,
        });
    } catch (error) {
        dispatch({
            type: "getAllEventsShopFailed",
            payload: error.response?.data?.message || "An error occurred",
        });
    }
};

// Delete event of a shop
export const deleteEvent = (id) => async (dispatch) => {
    try {
        dispatch({ type: "deleteEventRequest" });

        const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, {
            withCredentials: true,
        });

        dispatch({
            type: "deleteEventSuccess",
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: "deleteEventFailed",
            payload: error.response?.data?.message || "An error occurred",
        });
    }
};

// Get all events for homepage
export const getAllEvents = () => async (dispatch) => {
    try {
        dispatch({ type: "getAllEventsRequest" }); // Fixed: added quotes around the type string

        const { data } = await axios.get(`${server}/event/get-all-events`);
        dispatch({
            type: "getAllEventsSuccess",
            payload: data.events,
        });
    } catch (error) {
        dispatch({
            type: "getAllEventsFailed",
            // Fixed: dat -> data
            payload: error.response?.data?.message || "An error occurred",
        });
    }
};