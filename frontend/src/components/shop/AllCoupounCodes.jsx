import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProductsShop } from "../../redux/actions/product";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../Layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import styles from "../../styles/styles.js";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";

const AllCoupounCodes = () => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [coupouns, setCoupouns] = useState([])
    const [value, setValue] = useState(null);
    const [minAmount, setMinAmount] = useState(null);
    const [maxAmount, setMaxAmount] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState("");

    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`${server}/coupon/get-coupon/${seller._id}`, {
                withCredentials: true,
            })
            .then((res) => {
                setIsLoading(false);
                console.log(res.data);
                setCoupouns(res.data.couponCodes || []);

            })
            .catch((error) => {
                setIsLoading(false);
            });
    }, [dispatch, seller._id]);

    const handleDelete = async (id) => {
        try {
            // Match the method (delete) used in the backend
            const res = await axios.delete(`${server}/coupon/delete-coupon/${id}`, {
                withCredentials: true, // Important if you're using cookies/sessions
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setCoupouns((prevCoupons) => prevCoupons.filter((item) => item._id !== id));
                // Add logic here to refresh your list (e.g., window.location.reload() or state update)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios
            .post(
                `${server}/coupon/create-coupon-code`,
                {
                    name,
                    minAmount,
                    maxAmount,
                    selectedProducts,
                    value,
                    shop: seller,
                },
                { withCredentials: true },
            )
            .then((res) => {
                console.log(res.data);

                toast.success(res.data.message);
                setOpen(false)
                window.location.reload()
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    };
    const columns = [
        { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
        { field: "name", headerName: "Name", minWidth: 180, flex: 1.4 },
        { field: "price", headerName: "Price", minWidth: 100, flex: 0.6 },



        {
            field: "Delete",
            flex: 0.8,
            minWidth: 120,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Button onClick={() => handleDelete(params.id)}>
                            <AiOutlineDelete size={20} />
                        </Button>
                    </>
                );
            },
        },
    ];

    const row = [];
    coupouns &&
        coupouns.forEach((item) => {
            row.push({
                id: item._id,
                name: item.name,
                price: item.value + "%",
                sold: 10,
            });
        });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full mx-8 pt-1 mt-10 bg-white">
                    <div className="w-full flex justify-end">
                        <div
                            className={`${styles.button} w-max! !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
                            onClick={() => setOpen(true)}
                        >
                            <span className="text-white">Create Coupon code</span>
                        </div>
                    </div>
                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableRowSelectionOnClick
                        autoHeight
                    />
                    {open && (
                        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[200000] flex items-center justify-center">
                            <div className="w-[90%] 800px:w-[40%] h-[80vh] overflow-y-scroll bg-white rounded-md shadow p-4">
                                <div className="w-full flex justify-end">
                                    <RxCross1
                                        size={30}
                                        className="cursor-pointer"
                                        onClick={() => setOpen(false)}
                                    />
                                </div>
                                <h5 className="text-[30px] font-poppins text-center">
                                    Create Coupon Code
                                </h5>
                                {/* Create Coupon Code */}
                                <form onSubmit={handleSubmit} aria-required={true}>
                                    <br />
                                    <div>
                                        <label htmlFor="name" className="pb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={name}
                                            required
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                            placeholder="Enter your Coupon Code name..."
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <label htmlFor="name" className="pb-2">
                                            Discount Percentage{" "}
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="value"
                                            required
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                            placeholder="Enter your Coupon Code Discount Percentage..."
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <label htmlFor="name" className="pb-2">
                                            Minimum Amount
                                        </label>
                                        <input
                                            type="text"
                                            name="minAmount"
                                            value={minAmount}
                                            onChange={(e) => setMinAmount(e.target.value)}
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                            placeholder="Enter your Coupon Code Minimum Amount..."
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <label htmlFor="name" className="pb-2">
                                            Max Amount
                                        </label>
                                        <input
                                            type="text"
                                            name="maxAmount"
                                            value={maxAmount}
                                            onChange={(e) => setMaxAmount(e.target.value)}
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                            placeholder="Enter your Coupon Code Maximum Amount..."
                                        />
                                    </div>
                                    <br />
                                    <div>
                                        <label htmlFor="category" className="pb-2">
                                            Selected Products
                                        </label>
                                        <select
                                            name="selectedProducts"
                                            className="w-full mt-2 border h-[35px] rounded-[5px] border-gray-300"
                                            id=""
                                            value={selectedProducts}
                                            onChange={(e) => setSelectedProducts(e.target.value)}
                                        >
                                            <option value="Choose your selected product...">
                                                Choose a selected product
                                            </option>
                                            {products &&
                                                products.map((i) => (
                                                    <option value={i.name} key={i.name}>
                                                        {i.name}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                    <br />
                                    <div>
                                        <input
                                            type="submit"
                                            value="Create"
                                            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AllCoupounCodes;
