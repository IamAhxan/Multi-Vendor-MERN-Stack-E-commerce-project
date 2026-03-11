import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { useParams } from "react-router-dom";

const TrackOrder = () => {
    const { orders } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const { id } = useParams();
    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch]);

    const data = orders && orders.find((order) => order._id === id);
    console.log(data);

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">
            <>
                {data?.Status === "Processing" ? (
                    <h1 className="text-center text-[20px]">
                        Your Order is processing in shop!
                    </h1>
                ) : data?.Status === "Transferred to dlivery partner" ? (
                    <h1 className="text-center text-[20px]">Your Order is on the way!</h1>
                ) : data?.Status === "Shipping" ? (
                    <h1 className="text-center text-[20px]">Your Order is Shipped!</h1>
                ) : data?.Status === "Received" ? (
                    <h1 className="text-center text-[20px]">
                        Your Order is in your city, will be delivered soon!
                    </h1>
                ) : data?.Status === "On the Way" ? (
                    <h1 className="text-center text-[20px]">
                        Your Order is on the way to your address!
                    </h1>
                ) : data?.Status === "Delivered" ? (
                    <h1 className="text-center text-[20px]">Your Order is Delivered!</h1>
                ) : data?.Status === "Processing Refund" ? (
                    <h1 className="text-center text-[20px]">
                        Your refund is in process!
                    </h1>
                ) : data?.Status === "Refund Success" ? (
                    <h1 className="text-center text-[20px]">
                        Your refund is successful, amount will be credited in your account soon!
                    </h1>
                ) : null}
            </>
        </div>
    );
};

export default TrackOrder;
