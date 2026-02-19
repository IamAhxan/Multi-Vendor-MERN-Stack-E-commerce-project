import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineMessage,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart";
import { backend_url } from "../../../server";
import {
    addToWishlist,
    removeFromWishlist,
} from "../../../redux/actions/wishlis";

const ProductDetailsCard = ({ setOpen, data }) => {
    const { cart } = useSelector((state) => state.cart);
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);
    const [select, setSelect] = useState(false);

    const { wishlist } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();

    const handleMessageSubmit = () => { };
    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };
    const incrementCount = () => {
        setCount(count + 1);
    };
    const addToCartHandler = (id) => {
        const isItemExists = cart && cart.find((i) => i._id === id);
        if (isItemExists) {
            toast.error("Item already in cart!");
        } else {
            if (data.stock < count) {
                toast.error("Product Stock Limited!");
            } else {
                const cartData = { ...data, qty: count };
                dispatch(addToCart(cartData));
                toast.success("Item added to cart successfully!");
            }
        }
    };

    useEffect(() => {
        if (wishlist && wishlist.find((i) => i._id === data._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist]);

    const removeFromWishlistHandler = (data) => {
        setClick(!click);
        dispatch(removeFromWishlist(data));
    };
    const addToWishlistHandler = () => {
        setClick(!click);

        dispatch(addToWishlist(data));
    };

    return (
        <div className="bg-white">
            {data ? (
                <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
                    <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 8000px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
                        <RxCross1
                            size={30}
                            className="absolute right-3 top-3 z-50"
                            onClick={() => setOpen(false)}
                        />

                        <div className="block w-full 800px:flex">
                            <div className="full 800px:w-[50%]">
                                <img src={`${backend_url}upload/${data?.images?.[0]}`} alt="" />
                                <div className="flex">
                                    <img
                                        src={data.shop.avatar}
                                        alt=""
                                        className="w-[50px] h-[50px] rounded-full mr-2"
                                    />
                                    <div>
                                        <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                                        <h5 className="pb-3 text-[15px]">
                                            ( {data.shop.ratings}) Ratings
                                        </h5>
                                    </div>
                                </div>
                                <div
                                    className={`${styles.button} bg-black mt-4 !rounded-[4px] h-11`}
                                    onClick={handleMessageSubmit}
                                >
                                    <span className="text-white flex items-center">
                                        Send Message <AiOutlineMessage className="ml-1" />
                                    </span>
                                </div>
                                <h5 className="text-[16px] text-[red] mt-5">
                                    ({data.total_sell}) Sold Out
                                </h5>
                            </div>
                            {/* Right Side */}
                            <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                                <h1 className={`${styles.productTitle} text-[20px]`}>
                                    {data.name}
                                </h1>
                                <p>{data.description}</p>
                                <div className="flex pt-3">
                                    <h4 className={`${styles.productDiscountPrice}`}>
                                        {data.discount_price}$
                                    </h4>
                                    <h3 className={`${styles.price}`}>
                                        {data.price ? data.price + "$" : null}
                                    </h3>
                                </div>
                                <div className="flex items-center mt-12 justify-between pr-3">
                                    <div>
                                        <button
                                            className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                                            onClick={decrementCount}
                                        >
                                            -
                                        </button>
                                        <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                                            {count}
                                        </span>
                                        <button
                                            className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                                            onClick={incrementCount}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div>
                                        {click ? (
                                            <AiFillHeart
                                                size={22}
                                                className="cursor-pointer"
                                                onClick={() => removeFromWishlistHandler(data)}
                                                color={click ? "red" : "#333"}
                                                title="Remove from wishList"
                                            />
                                        ) : (
                                            <AiOutlineHeart
                                                size={22}
                                                className="cursor-pointer"
                                                onClick={() => addToWishlistHandler(data)}
                                                color={click ? "red" : "#333"}
                                                title="Add to wishList"
                                            />
                                        )}
                                    </div>
                                </div>
                                <div
                                    className={`${styles.button} mt-6 !rounded-[4px] h-11 flex items-center`}
                                    onClick={() => addToCartHandler(data._id)}
                                >
                                    <span className="text-white flex items-center">
                                        Add to Cart <AiOutlineShoppingCart className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default ProductDetailsCard;
