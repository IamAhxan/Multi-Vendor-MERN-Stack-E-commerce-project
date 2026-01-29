import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { toast } from "react-toastify";

const SellerActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activation_token) return;


        const activateAccount = async () => {
            setLoading(true);
            try {
                await axios.post(`${server}/shop/activation`, { activation_token });
                setError(false);
            } catch (err) {
                setError(true);
                toast.error(err)
            } finally {
                setLoading(false);
            }
        };


        activateAccount();
    }, [])

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "18px",
                fontWeight: "500",
            }}
        >
            {loading ? (
                <p>Activating your account...</p>
            ) : error ? (
                <p>Your activation link is invalid or expired ❌</p>
            ) : (
                <p>Your account has been activated successfully ✅</p>
            )}
        </div>
    );
};

export default SellerActivationPage;
