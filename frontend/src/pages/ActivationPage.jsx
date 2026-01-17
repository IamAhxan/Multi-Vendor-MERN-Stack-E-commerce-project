import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { toast } from "react-toastify";

const ActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!activation_token) {
            setError(true);
            setLoading(false);
            return;
        }

        const activateAccount = async () => {
            try {
                const res = await axios.post(`${server}/user/activation`, {
                    activation_token,
                });

                toast.success("Account activated successfully 🎉");
                setError(false);
            } catch (err) {
                toast.error(err.response?.data?.message || "Activation failed");
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        activateAccount();
    }, [activation_token]);

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

export default ActivationPage;
