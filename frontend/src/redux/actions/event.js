//  create event

import axios from "axios";
import { server } from "../../server";

export const createevent = (newForm) => async (dispatch) => {
    try {
        dispatch({
            type: "eventCreateRequest"
        });
        const config = { headers: { "Content-Type": "multipart/formData" } }
        const { data } = await axios.post(`${server}/event/create-event`,
            newForm,
            config
        )


        dispatch({
            type: "eventCreateSuccess",
            payload: data.event,
        });

    } catch (error) {
        dispatch({
            type: "eventCreateFail",
            payload: error.respone.data.message
        })
    }
}


// get all events

export const getAlleventsShop = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "getAlleventsShopRequest",
        })
        const { data } = await axios.get(`${server}/event/get-all-events-shop/${id}`)
        dispatch({
            type: "getAlleventsShopSuccess",
            payload: data.events
        })
    } catch (error) {
        dispatch({
            type: "getAlleventsShopFailed",
            payload: error.response.data.message,
        })
    }
}


// Delete event of a Shop


export const deleteevent = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteeventRequest",
        })

        const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, {
            withCredentials: true
        }
        )

        dispatch({
            type: "deleteeventSuccess",
            payload: data.message
        })


    } catch (error) {
        dispatch({
            type: "deleteeventFailed",
            payload: error.response.data.message,
        })
    }
}

// Get Al events of a shop

export const getAllEventsShop = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "getAllEventsShopRequest",
        })
        const { data } = await axios.get(`${server}/event/get-all-events/${id}`)
        dispatch({
            type: "getAllEventsShopSuccess",
            payload: data.events
        })
    } catch (error) {
        dispatch({
            type: "getAllEventsShopFailed",
            payload: error.response.data.message,
        })
    }
}

// Delete Event of a shop

export const deleteEvent = (id) => async (dispatch) => {
    try {
        dispatch({
            type: "deleteEventRequest",
        })

        const { data } = await axios.delete(`${server}/event/delete-shop-events/${id}`, {
            withCredentials: true
        }
        )

        dispatch({
            type: "deleteEventSuccess",
            payload: data.message
        })


    } catch (error) {
        dispatch({
            type: "deleteEventFailed",
            payload: error.response.data.message,
        })
    }
}