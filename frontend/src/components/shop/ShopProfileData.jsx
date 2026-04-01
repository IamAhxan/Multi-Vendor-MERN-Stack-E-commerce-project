import React, { act, useEffect, useState } from "react";
import { productData } from "../../static/data"
import ProductCard from "./../Route/ProductCard/ProductCard"
import styles from "../../styles/styles";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { backend_url } from "../../server";
import Ratings from "../products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
    const { products } = useSelector((state) => state.products)
    const { events } = useSelector((state) => state.events)
    const { seller } = useSelector((state) => state.seller)
    const { id } = useParams()
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(getAllProductsShop(id))
        dispatch(getAllEventsShop(seller._id));

    }, [dispatch, id, seller?._id])
    const [active, setActive] = useState(1);

    const allReviews = products && products.map((product) => product.reviews).flat()
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">


                <div className="w-full flex">
                    <div className="flex items-center" onClick={() => setActive(1)}>
                        <h5
                            className={`font-[600] text-[20px] ${active === 1 ? "text-red-500" : "text-[#333]"} cursor-pointer pr-[20px] `}
                        >
                            Shop Products
                        </h5>
                    </div>

                    <div className="flex items-center" onClick={() => setActive(2)}>
                        <h5
                            className={`font-[600] text-[20px] ${active === 2 ? "text-red-500" : "text-[#333]"} cursor-pointer pr-[20px] `}
                        >
                            Running Events
                        </h5>
                    </div>

                    <div className="flex items-center" onClick={() => setActive(3)}>
                        <h5
                            className={`font-[600] text-[20px] ${active === 3 ? "text-red-500" : "text-[#333]"} cursor-pointer pr-[20px] `}
                        >
                            Shop Reviews
                        </h5>
                    </div>
                </div>
                {
                    isOwner && (
                        <div className="">
                            <Link to="/dashboard">
                                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                                    <span className="text-[#fff]">Go to Dashboard</span>
                                </div></Link>
                        </div>
                    )
                }

            </div>
            <br />
            {
                active === 1 && (
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
                        {
                            products && products.map((i, index) => {
                                return <ProductCard data={i} key={index} />
                            }
                            )
                        }
                    </div>
                )
            }

            {
                active === 2 && (
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
                        {
                            events && events.map((i, index) => {
                                return <ProductCard data={i} key={index} isEvent={true} />
                            }
                            )
                        }
                    </div>
                )
            }

            {
                active === 3 && (
                    <div className="w-full">
                        {
                            allReviews && allReviews.map((item, index) => (
                                <div div className="w-full flex my-4" >
                                    <img src={`${item.user.avatar}`} className="w-[50px] h-[50px] rounded-full" alt="" />
                                    <div className="pl-2">
                                        <div className="w-full flex items-center">
                                            <h1 className="font-[600] pr-2">{item.user.name}</h1>
                                            <Ratings rating={item.rating} />
                                        </div>

                                        <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                                        <p className="text-[#000000a7] text-[14px]">{item.createdAt.slice(0, 10) || "2 Days Ago"}</p>


                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
            {
                products && products.length === 0 && (
                    <h5 className="w-full text-center pb-[100px] text-[20px]">No Products Found!</h5>
                )
            }


        </div >
    );
};

export default ShopProfileData;
