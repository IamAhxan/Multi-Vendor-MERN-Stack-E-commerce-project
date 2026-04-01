import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
    const { seller } = useSelector((state) => state.seller);
    const [avatar, setAvatar] = useState(null);
    const dispatch = useDispatch();
    const [name, setName] = useState(seller?.name || "");
    const [description, setDescription] = useState(seller?.description || "");
    const [address, setAddress] = useState(seller?.address || "");
    const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || null);
    const [zipCode, setZipCode] = useState(seller?.zipCode || null);



    const handleImage = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setAvatar(file);
        const formData = new FormData();
        formData.append("image", file);

        await axios.put(`${server}/shop/update-shop-avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        }).then((res) => {

            dispatch(loadSeller())
            toast.success(res.data.message);
        }).catch((error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to update avatar");
        });
    }

    const updateHandler = async (e) => {
        e.preventDefault()
        await axios.put(`${server}/shop/update-shop-info`, {
            name,
            address,
            zipCode,
            phoneNumber,
            description,
        }, {
            withCredentials: true,
        }).then((res) => {
            dispatch(loadSeller())
            toast.success(res.data.message);
        }).catch((error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to update shop information");
        });
    }
    // const dispatch = useDispatch()
    // const [isLoading, setIsLoading] = useState(false)
    // const [data, setData] = useState({})
    // const { id } = useParams()

    // useEffect(() => {
    //     dispatch(getAllProductsShop(id));
    //     setIsLoading(true);
    //     axios.get(`${server}/shop/get-shop-info/${id}`)
    //         .then((res) => {
    //             setData(res.data.shop);
    //             setIsLoading(false);
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //             setIsLoading(false);
    //         });
    // }, [dispatch, id]);

    return (
        <div className="w-full min-h-screen flex flex-col items-center">
            <div className="flex w-full 800px:w-[80%] flex-col justify-center">
                <div className="w-full flex items-center justify-center py-5">
                    <div className="relative">
                        <img
                            src={avatar ? URL.createObjectURL(avatar) : `${seller.avatar}`}
                            alt="Shop Avatar"
                            className="w-[150px] h-[150px] object-cover rounded-full border-[3px] border-[#3ad132] cursor-pointer "
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

                {/* Shop Ingo */}

                <form
                    aria-required={true}
                    className="flex items-center flex-col items-center"
                    onSubmit={updateHandler}
                >
                    <div className="w-[100%] flex items-center flex-col  800px:w-[50%] mt-5">
                        <div className="w-full pl-[3%]">
                            <label htmlFor="" className="block pb-2">
                                Shop Name
                            </label>
                        </div>
                        <input
                            type="name"
                            className={`${styles.input} !w-[95%]  bg-white mb-4  800px:mb-0`}
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={`${seller?.name}`}
                        />
                    </div>

                    <div className="w-[100%] flex items-center flex-col  800px:w-[50%] mt-5">
                        <div className="w-full pl-[3%]">
                            {" "}
                            <label htmlFor="" className="block pb-2">
                                Shop Description
                            </label>
                        </div>
                        <input
                            type="name"
                            className={`${styles.input} !w-[95%] bg-white mb-4  800px:mb-0`}
                            value={description ? description : null}
                            onChange={(e) => setDescription(e.target.value)}

                            placeholder={`${seller?.descrption ? seller?.descrption : "Enter your description"}`}
                        />
                    </div>

                    <div className="w-[100%] flex items-center flex-col  800px:w-[50%] mt-5">
                        <div className="w-full pl-[3%]">
                            {" "}
                            <label htmlFor="" className="block pb-2">
                                Shop Address
                            </label>
                        </div>
                        <input
                            type="address"
                            className={`${styles.input} !w-[95%] bg-white mb-4  800px:mb-0`}
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}

                            placeholder={`${seller?.address}`}
                        />
                    </div>

                    <div className="w-[100%] flex items-center flex-col  800px:w-[50%] mt-5">
                        <div className="w-full pl-[3%]">
                            {" "}
                            <label htmlFor="" className="block pb-2">
                                Shop Phone Number
                            </label>
                        </div>
                        <input
                            type="number"
                            className={`${styles.input} !w-[95%] bg-white mb-4 800px:mb-0`}
                            required
                            value={`0${phoneNumber}`}
                            onChange={(e) => setPhoneNumber(e.target.value)}

                            placeholder={`0${seller?.phoneNumber}`}
                        />
                    </div>

                    <div className="w-[100%] flex items-center flex-col  800px:w-[50%] mt-5">
                        <div className="w-full pl-[3%]">
                            {" "}
                            <label htmlFor="" className="block pb-2">
                                Shop Zipcode
                            </label>
                        </div>
                        <input
                            type="number"
                            className={`${styles.input} !w-[95%] bg-white mb-4 800px:mb-0`}
                            required
                            value={seller?.zipCode}
                            onChange={(e) => setZipCode(e.target.value)}

                            placeholder={seller?.zipCode}
                        />
                    </div>

                    <div className="w-[100%] flex items-center flex-col  800px:w-[50%] mt-5">
                        <input
                            type="submit"
                            className={`${styles.input} !w-[95%] bg-white mb-4 mb-4  800px:mb-0`}
                            required
                            readOnly
                            value="Update Shop Information"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ShopSettings;
