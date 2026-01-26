import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx"
import { IoBagHandleOutline } from 'react-icons/io5'
import { HiPlus, HiOutlineMinus } from "react-icons/hi"
import styles from "../../../styles/styles";
import { BsCartPlus } from "react-icons/bs"
import { Link } from 'react-router-dom'
import { AiOutlineHeart } from "react-icons/ai";

const Wishlist = ({ setOpenWishlist }) => {
    const cartData = [
        {
            name: "IPhone 14 Pro Max 8/256GB",
            description: "TEst",
            price: "999",
        },
        {
            name: "IPhone 14 Pro Max 8/256GB",
            description: "TEst",
            price: "1099",
        },
        {
            name: "IPhone 14 Pro Max 8/256GB",
            description: "TEst",
            price: "999",
        },
    ];
    return (
        <div className="fixed top-0 left-0 w-full bg-[#0000004b] min-h-screen z-10">
            <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between">
                <div>
                    <div className="flex w-full justify-end pt-5 pr-5">
                        <RxCross1
                            size={25}
                            className="cursor-pointer"
                            onClick={() => setOpenWishlist(false)}
                        />
                    </div>
                    {/* Items Length */}
                    <div className={`${styles.normalFlex} p-4`}>
                        <AiOutlineHeart size={25} />
                        <h5 className="pl-2 text-[20px] font-[500]">3 Items</h5>
                    </div>
                    {/* Cart Single Items */}
                    <div className="w-full border-t">
                        {
                            cartData && cartData.map((i, index) => (
                                <CartSingle key={index} data={i} />
                            ))
                        }
                    </div>
                </div>

            </div>
        </div>
    );
};


const CartSingle = ({ data }) => {
    const [value, setValue] = useState(1)
    const totalPrice = data.price * value
    return (
        <div className="border-b p-4">
            <div className="w-full flex items-center">
                <RxCross1 className="cursor-pointer" />
                <img src="https://st-troy.mncdn.com/mnresize/1500/1500/Content/media/ProductImg/original/mpwp3tua-apple-iphone-14-256gb-mavi-mpwp3tua-637986832343472449.jpg" alt="" className="w-[80px] h-[80px] ml-2" />


                <div className="pl-[5px]">
                    <h1>{data.name}</h1>
                    <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-roboto">US${totalPrice}</h4>
                </div>
                <div>
                    <BsCartPlus size={20} className="cursor-pointer" title="Add to Cart" />
                </div>
            </div>
        </div>
    )
}

export default Wishlist;
