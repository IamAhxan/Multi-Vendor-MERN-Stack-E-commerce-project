import React, { useEffect, useState } from "react";
import { backend_url, server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import {
    AiOutlineArrowRight,
    AiOutlineCamera,
    AiOutlineDelete,
} from "react-icons/ai";
import styles from "../../styles/styles.js";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { MdOutlineTrackChanges } from "react-icons/md";
import { updateUserInformation } from "../../redux/actions/user.js";
import Loader from "../Layout/Loader.jsx";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { Country, State, City } from "country-state-city";
import axios from "axios";

const ProfileContent = ({ active }) => {
    const { user, loading, error } = useSelector((state) => state.user);
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch();

    if (loading) {
        return (
            <div>
                <Loader />
            </div>
        ); // Or a spinner
    }
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPhoneNumber(user.phoneNumber);
        }
    }, [user]);
    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserInformation(email, password, phoneNumber, name));
    };
    const handleImage = async (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        await axios
            .put(`${server}/user/update-avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                toast.error(error);
            });
    };

    return (
        <div className="w-full">
            {/* Profile Page Content */}
            {active === 1 && (
                <>
                    <div className="flex justify-center w-full">
                        <div className="relative">
                            <img
                                src={`${backend_url}upload/${user?.avatar}`}
                                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                                alt="user"
                            />
                            <div className="w-[30px] bg-[#e3e9ee] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                                <input
                                    type="file"
                                    id="image"
                                    className="hidden"
                                    onChange={handleImage}
                                />
                                <label htmlFor="image">
                                    {" "}
                                    <AiOutlineCamera />
                                </label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="w-full px-5">
                        <form onSubmit={handleSubmit} aria-required={true}>
                            <div className="w-full 800px:flex 800px:flex-wrap block pb-3">
                                <div className="w-[100%] 800px:w-[50%]">
                                    <label htmlFor="" className="block pb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className={`${styles.input} !w-[95%] bg-white mb-4 800px:mb-0`}
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="w-[100%] 800px:w-[50%]">
                                    <label htmlFor="" className="block pb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="text"
                                        className={`${styles.input} !w-[95%] bg-white mb-4 800px:mb-0`}
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="w-[100%] 800px:w-[50%]">
                                    <label htmlFor="" className="block pb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="number"
                                        className={`${styles.input} !w-[95%] bg-white mb-4 800px:mb-0`}
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                                <div className="w-[100%] 800px:w-[50%]">
                                    <label htmlFor="" className="block pb-2">
                                        Enter Your Password
                                    </label>
                                    <input
                                        type="password"
                                        className={`${styles.input} !w-[95%] bg-white mb-4 800px:mb-0`}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <input
                                type="submit"
                                value="update"
                                required
                                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a23db] rounded-[3px] mt-8 cursor-pointer`}
                            />
                        </form>
                    </div>
                </>
            )}

            {/* Order Page*/}
            {active === 2 && (
                <div className="">
                    <AllOrders />
                </div>
            )}

            {/* Refunds Page*/}
            {active === 3 && (
                <div className="">
                    <AllRefundOrders />
                </div>
            )}

            {/* Track Order Page*/}
            {active === 5 && (
                <div className="">
                    <TrackOrder />
                </div>
            )}

            {/* Payment Methods Page*/}
            {active === 6 && (
                <div className="">
                    <PaymentMethods />
                </div>
            )}

            {/* User Address Page*/}
            {active === 7 && (
                <div className="">
                    <Address />
                </div>
            )}
        </div>
    );
};

const AllOrders = () => {
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const orders = [
        {
            _id: "12312312312dasdas",
            orderItems: [
                {
                    name: "IPhone 14 pro max",
                },
            ],
            totalPrice: 120,
            orderStatus: "processing",
        },
    ];

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.value === "Delivered" ? "greenColor" : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/order/${params.id}`}>
                            <Button>
                                <AiOutlineArrowRight size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];

    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.orderItems.length, // Fixed: changed .cart to .orderItems
                total: "US$ " + item.totalPrice,
                status: item.orderStatus, // Fixed: changed .status to .orderStatus
            });
        });
    return (
        <div className="pl-8 pt-1">
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableRowSelectionOnClick
                autoHeight
            />
        </div>
    );
};

const AllRefundOrders = () => {
    const orders = [
        {
            _id: "12312312312dasdas",
            orderItems: [
                {
                    name: "IPhone 14 pro max",
                },
            ],
            totalPrice: 120,
            orderStatus: "processing",
        },
    ];

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.value === "Delivered" ? "greenColor" : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/order/${params.id}`}>
                            <Button>
                                <AiOutlineArrowRight size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];
    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.orderItems.length, // Fixed: changed .cart to .orderItems
                total: "US$ " + item.totalPrice,
                status: item.orderStatus, // Fixed: changed .status to .orderStatus
            });
        });

    return (
        <div className="pl-8 pt-1">
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                autoHeight
                disableRowSelectionOnClick
            />
        </div>
    );
};

const TrackOrder = () => {
    const orders = [
        {
            _id: "12312312312dasdas",
            orderItems: [
                {
                    name: "IPhone 14 pro max",
                },
            ],
            totalPrice: 120,
            orderStatus: "processing",
        },
    ];

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.value === "Delivered" ? "greenColor" : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/user/order/${params.id}`}>
                            <Button>
                                <MdOutlineTrackChanges size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];
    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.orderItems.length, // Fixed: changed .cart to .orderItems
                total: "US$ " + item.totalPrice,
                status: item.orderStatus, // Fixed: changed .status to .orderStatus
            });
        });

    return (
        <div className="pl-8 pt-1">
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                autoHeight
                disableRowSelectionOnClick
            />
        </div>
    );
};

const PaymentMethods = () => {
    return (
        <div className="w-full px-5">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
                    Payment Methods
                </h1>
                <div className={`${styles.button} !rounded-md`}>
                    <span className="text-white">Add New</span>
                </div>
            </div>
            <br />
            <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
                <div className="flex items-center">
                    <img
                        src="https://bonik-react.vercel.app/assets/images/payment-methods/visa.png"
                        alt=""
                    />
                    <h5 className="pl-5 font-[600]">Ahsan</h5>
                </div>
                <div className="pl-8 flex items-center">
                    <h6>1234 **** **** 1234</h6>
                    <h5 className="pl-6">08/2030</h5>
                </div>
                <div className="min-w-[10%] flex items-center justify-between pl-8">
                    <AiOutlineDelete size={25} className="cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

const Address = () => {
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [addressType, setAddressType] = useState("");
    const { user } = useSelector((state) => state.user);

    const addressTypeData = [
        {
            name: "Default",
        },
        {
            name: "Home",
        },
        {
            name: "Office",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (addressType === "" || country === "" || city === "") {
            toast.error("Please fill all the fields");
        } else {
            //
        }
    };

    return (
        <div className="w-full px-5">
            {open && (
                <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center">
                    <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
                        <div className="w-full flex justify-end p-3">
                            <RxCross1
                                size={30}
                                className="cursor-pointer "
                                onClick={() => setOpen(false)}
                            />
                        </div>
                        <h1 className="text-center text-[25px]  font-poppins">
                            Add New Address
                        </h1>
                        <div className="w-full">
                            <form aria-required onSubmit={handleSubmit} className="w-full">
                                <div className="w-full block p-4">
                                    <div className="w-full pb-2">
                                        <label htmlFor="" className="block pb-2">
                                            Country
                                        </label>
                                        <select
                                            className="w-[95%] border h-[40px] rounded-[5px] "
                                            name=""
                                            id=""
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                        >
                                            <option value="" className="block border pb-2">
                                                Choose your country
                                            </option>
                                            {Country &&
                                                Country.getAllCountries().map((item) => (
                                                    <option
                                                        value={item.isoCode}
                                                        className="block pb-2"
                                                        key={item.isoCode}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <div className="w-full pb-2">
                                        <label htmlFor="" className="block pb-2">
                                            City
                                        </label>
                                        <select
                                            className="w-[95%] border h-[40px] rounded-[5px] "
                                            name=""
                                            id=""
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        >
                                            <option value="" className="block border pb-2">
                                                Choose your City
                                            </option>
                                            {country &&
                                                City.getCitiesOfCountry(country).map((item) => (
                                                    <option
                                                        value={item.isoCode}
                                                        className="block pb-2"
                                                        key={item.isoCode}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="w-full pb-2">
                                        <label htmlFor="" className="block pb-2">
                                            Address 1
                                        </label>
                                        <input
                                            type="address"
                                            className={`${styles.input}`}
                                            required
                                            value={address1}
                                            onChange={(e) => setAddress1(e.target.value)}
                                        />
                                    </div>

                                    <div className="w-full pb-2">
                                        <label htmlFor="" className="block pb-2">
                                            Address 2
                                        </label>
                                        <input
                                            type="address"
                                            className={`${styles.input}`}
                                            required
                                            value={address2}
                                            onChange={(e) => setAddress2(e.target.value)}
                                        />
                                    </div>

                                    <div className="w-full pb-2">
                                        <label htmlFor="" className="block pb-2">
                                            Zip Code
                                        </label>
                                        <input
                                            type="number"
                                            className={`${styles.input}`}
                                            required
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                        />
                                    </div>

                                    <div className="w-full pb-2">
                                        <label htmlFor="" className="block pb-2">
                                            Address Type
                                        </label>
                                        <select
                                            className="w-[95%] border h-[40px] rounded-[5px] "
                                            name=""
                                            id=""
                                            value={addressType}
                                            onChange={(e) => setAddressType(e.target.value)}
                                        >
                                            <option value="" className="block border pb-2">
                                                Choose your Address Type
                                            </option>
                                            {addressTypeData &&
                                                addressTypeData.map((item) => (
                                                    <option
                                                        value={item.name}
                                                        className="block pb-2"
                                                        key={item.name}
                                                    >
                                                        {item.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="w-full pb-2">
                                        <input
                                            type="submit"
                                            className={`${styles.input} mt-5 cursor-pointer`}
                                            required
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex w-full items-center justify-between">
                <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
                    My Addresses
                </h1>
                <div
                    className={`${styles.button} !rounded-md`}
                    onClick={() => setOpen(true)}
                >
                    <span className="text-white">Add New</span>
                </div>
            </div>
            <br />
            <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
                <div className="flex items-center">
                    <h5 className="pl-5 font-[600]">Default Address</h5>
                </div>
                <div className="pl-8 flex items-center">
                    <h6>Adress</h6>
                </div>
                <div className="pl-8 flex items-center">
                    <h6>0300000000</h6>
                </div>
                <div className="min-w-[10%] flex items-center justify-between pl-8">
                    <AiOutlineDelete size={25} className="cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

export default ProfileContent;
