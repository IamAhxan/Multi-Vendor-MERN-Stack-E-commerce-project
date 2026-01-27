import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import styles from './../../styles/styles.js'
import { Link, useNavigate } from 'react-router-dom'
import { server } from "../../server.js"
import { toast } from "react-toastify"
import axios from 'axios'
import { RxAvatar } from "react-icons/rx";

const ShopCreate = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [avatar, setAvatar] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false)
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!avatar) {
            toast.error("Please upload an avatar");
            return;
        }

        try {
            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };

            const newForm = new FormData();
            newForm.append("file", avatar);
            newForm.append("name", name);
            newForm.append("email", email);
            newForm.append("password", password);
            newForm.append("zipCode", zipCode);
            newForm.append("address", address);
            newForm.append("phoneNumber", phoneNumber);

            const res = await axios.post(
                `${server}/shop/create-shop`,
                newForm,
                config
            );

            toast.success(res.data.message);

            setName("");
            setEmail("");
            setPassword("");
            setAvatar(null);
            setZipCode("");
            setAddress("");
            setPhoneNumber("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        }

    }
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
    };
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Register as a seller
                </h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Shop Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="name"
                                    name="name"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 foxus:outline-none focus:ring-blue-500"
                                />
                            </div>
                        </div>



                        <div>
                            <label
                                htmlFor="phone-number"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Shop Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="phone-number"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 foxus:outline-none focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Shop Email
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 foxus:outline-none focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="address"
                                    name="address"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 foxus:outline-none focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="zipcode"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Zip Code
                            </label>
                            <div className="mt-1">
                                <input
                                    type="zipcode"
                                    name="zipcode"
                                    required
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 foxus:outline-none focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    type={visible ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 foxus:outline-none focus:ring-blue-500"
                                />
                                {
                                    visible ? <AiOutlineEye className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(false)} /> : <AiOutlineEyeInvisible className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(true)} />
                                }
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="avatar"
                                className="block text-sm font-medium text-gray-700"
                            ></label>
                            <div className="mt-2 flex items-center">
                                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                                    {avatar ? (
                                        <img
                                            src={URL.createObjectURL(avatar)}
                                            name="file"
                                            alt="avatar"
                                            className="h-full w-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <RxAvatar className="h-8 w-8" />
                                    )}
                                </span>
                                <label
                                    htmlFor="file-input"
                                    className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text=sm font-medium text-gray-700 bg-white hover:bg-gray-50 "
                                >
                                    <span>Upload a file</span>
                                    <input
                                        type="file"
                                        name="file"
                                        id="file-input"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleFileInputChange}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>



                        <div className={`${styles.normalFlex} justify-between`}>
                            <div className={`${styles.normalFlex}`}>
                                <input type="checkbox" name="remember-me" id="remember-me" className="h-4 w-4 text-blue-600 foxus:ring-blue-50 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="group relative w-full text-white h-10 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-whote bg-blue-600 hover:bg-blue-700">Submit</button>
                        </div>
                        <div className={`${styles.normalFlex} w-full `}>
                            <h4>Already have an account?</h4>
                            <Link to="/shop-login" className="text-blue-600 pl-2">Sign Up</Link>
                        </div>

                    </form>
                </div>
            </div >
        </div >
    );
}

export default ShopCreate