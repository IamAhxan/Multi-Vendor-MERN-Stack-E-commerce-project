import { useState } from "react";
import { RxCross1 } from "react-icons/rx"
import styles from "../../../styles/styles";
import { BsCartPlus } from "react-icons/bs"
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "./../../../redux/actions/wishlis"
import { backend_url } from "../../../server";
import { addToCart } from "../../../redux/actions/cart"

const Wishlist = ({ setOpenWishlist }) => {

    const { wishlist } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const removeFromWishlistHandler = (data) => {
        dispatch(removeFromWishlist(data));
    };


    const addToCartHandler = (data) => {
        const newData = { ...data, qty: 1 }
        dispatch(addToCart(data))
        setOpenWishlist(false)
    }

    return (
        <div className="fixed top-0 left-0 w-full bg-[#0000004b] min-h-screen z-10">
            <div className="w-[80%] fixed top-0 right-0 min-h-full 800px:w-[25%] bg-white flex flex-col justify-between">

                {
                    wishlist && wishlist.length === 0 ? (
                        <div className="w-full h-screen flex items-center justify-center">
                            <div className="flex w-full justify-end pt-5 pr-5 top-3 right-3 fixed">
                                <RxCross1
                                    size={25}
                                    className="cursor-pointer"
                                    onClick={() => setOpenWishlist(false)}
                                />
                            </div>
                            <h5>Wishlist is Empty!</h5>
                        </div>
                    ) : (
                        <>
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
                                    <h5 className="pl-2 text-[20px] font-[500]">{wishlist.length} Items</h5>
                                </div>
                                {/* Cart Single Items */}
                                <div className="w-full border-t">
                                    {
                                        wishlist && wishlist.map((i, index) => (
                                            <CartSingle key={index} data={i} removeFromWishlistHandler={removeFromWishlistHandler} addToCartHandler={addToCartHandler} />
                                        ))
                                    }
                                </div>
                            </div>
                        </>
                    )
                }

            </div >
        </div >
    );
};


const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
    const [value, setValue] = useState(1)
    const totalPrice = data.discountPrice * value;
    return (
        <div className="border-b p-4">
            <div className="w-full flex items-center">
                <RxCross1 className="cursor-pointer" onClick={() => removeFromWishlistHandler(data)} />
                <img
                    src={`${backend_url}upload/${data?.images?.[0]}`}
                    alt=""
                    className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
                />


                <div className="pl-[5px]">
                    <h1>{data.name}</h1>
                    <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-roboto">US${totalPrice}</h4>
                </div>
                <div>
                    <BsCartPlus size={20} className="cursor-pointer" title="Add to Cart" onClick={() => addToCartHandler(data)} />
                </div>
            </div>
        </div>
    )
}

export default Wishlist;
