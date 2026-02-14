import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Fixed: removed unused 'Links'
import styles from "./../../../styles/styles.js";
import { productData, categoriesData } from "../../../static/data.jsx";
import {
    AiOutlineHeart,
    AiOutlineSearch,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown.jsx";
import Navbar from "./Navbar.jsx";
import { useSelector } from "react-redux";
import { backend_url } from "../../../server.js";
import Cart from "../cart/Cart.jsx";
import Wishlist from "../wishlist/Wishlist.jsx";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const { allProducts } = useSelector((state) => state.products);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState(null);
    const [active, setActive] = useState(false);
    const [dropDown, setDropDown] = useState(false);
    const [openCart, setOpenCart] = useState(false);
    const [openWishlist, setOpenWishlist] = useState(false);
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 70) {
                setActive(true);
            } else {
                setActive(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length === 0) {
            setSearchData(null);
        } else {
            const filteredProduct =
                allProducts &&
                allProducts.filter((product) => {
                    return product.name.toLowerCase().includes(term.toLowerCase());
                });
            setSearchData(filteredProduct);
        }
    };

    return (
        <>
            {/* Top Header Section */}
            <div className={`${styles.section}`}>
                <div className="hidden 800px:h-12.5 800px:my-5 800px:flex items-center justify-between">
                    <div>
                        <Link to="/">
                            <img
                                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                                alt="logo"
                            />
                        </Link>
                    </div>

                    {/* Search Box */}
                    <div className="w-[50%] relative">
                        <input
                            type="text"
                            placeholder="Search Product..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="h-10 w-full px-2 border-[#3957db] border-2 rounded-md focus:outline-none"
                        />
                        <AiOutlineSearch
                            size={30}
                            className="absolute right-2 top-1.5 cursor-pointer"
                        />
                        {searchData && searchData.length !== 0 ? (
                            <div className="absolute min-h-[30vh] bg-white shadow-lg z-9 p-4 w-full">
                                {searchData.map((i, index) => {
                                    const product_name = i.name.replace(/\s+/g, "-");
                                    return (
                                        <Link to={`/product/${product_name}`} key={index}>
                                            <div className="w-full flex items-center py-3 hover:bg-gray-100 transition">
                                                <img
                                                    src={`${backend_url}upload/${i.images[0]}`}
                                                    alt=""
                                                    className="w-10 h-10 mr-2.5"
                                                />
                                                <h1 className="text-sm">{i.name}</h1>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    <div className={`${styles.button}`}>
                        <Link to="/shop-create">
                            <h1 className="text-white flex items-center">
                                Become a Seller <IoIosArrowForward className="ml-1" />
                            </h1>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Header Section (The Blue Navbar) */}
            <div
                className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : "relative"
                    } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-17.5`}
            >
                <div
                    className={`${styles.section} ${styles.normalFlex} justify-between w-[90%]`}
                >
                    {/* Categories Dropdown Wrapper */}
                    {/* Categories Dropdown Wrapper */}
                    <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
                        <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
                        <button
                            /* Fix: Use a callback that doesn't conflict with parent clicks */
                            onClick={(e) => {
                                e.stopPropagation();
                                setDropDown(!dropDown);
                            }}
                            className="h-full w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md relative"
                        >
                            All Categories
                        </button>
                        <IoIosArrowDown
                            size={20}
                            className="absolute right-2 top-4 cursor-pointer"
                            onClick={() => setDropDown(!dropDown)}
                        />
                        {dropDown && (
                            <DropDown
                                categoriesData={categoriesData}
                                setDropDown={setDropDown}
                            />
                        )}
                    </div>

                    {/* Navbar Component */}
                    <div className={`${styles.normalFlex}`}>
                        <Navbar active={activeHeading} />
                    </div>

                    <div className="flex">
                        <div className={`${styles.normalFlex}`}>
                            <div
                                className="relative cursor-pointer mr-3.75"
                                onClick={() => setOpenWishlist(true)}
                            >
                                <AiOutlineHeart size={30} color="rgb(255 255 255 /83%)" />
                                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                    0
                                </span>
                            </div>
                        </div>
                        <div className={`${styles.normalFlex}`}>
                            <div
                                className="relative cursor-pointer mr-3.75"
                                onClick={() => setOpenCart(true)}
                            >
                                <AiOutlineShoppingCart
                                    size={30}
                                    color="rgb(255 255 255 /83%)"
                                />
                                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                    1
                                </span>
                            </div>
                        </div>
                        <div className={`${styles.normalFlex}`}>
                            <div className="relative cursor-pointer mr-[15px]">
                                {isAuthenticated ? (
                                    <Link to="/profile">
                                        <img
                                            src={`${backend_url}${user.avatar}`}
                                            className="w-[35px] h-[35px] rounded-full"
                                            alt="user"
                                        />
                                    </Link>
                                ) : (
                                    <Link to="/login">
                                        <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                                    </Link>
                                )}
                            </div>
                        </div>
                        {/* Cart popup */}
                        {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
                        {/* Wishlist popup */}
                        {openWishlist ? (
                            <Wishlist setOpenWishlist={setOpenWishlist} />
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Mobile Header */}

            <div
                className={` ${active === true ? "shadow-sm fixed top-0 left-0 z-10" : "relative"
                    } w-full h-[60px] bg-white z-50 top-0 left-0 shadow-sm 800px:hidden`}
            >
                <div className="w-full flex items-center justify-between">
                    <div className="">
                        <BiMenuAltLeft
                            size={40}
                            className="ml-4"
                            onClick={() => setOpen(true)}
                        />
                    </div>
                    <div className="">
                        <Link to="/">
                            <img
                                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                                alt="logo"
                                className="mt-3 cursor-pointer"
                            />
                        </Link>
                    </div>
                    <div className="">
                        <div
                            className="relative cursor-pointer mr-4"
                            onClick={() => setOpenCart(true)}
                        >
                            <AiOutlineShoppingCart size={35} className="" />
                            <span className="absolute -right-1 -top-1 rounded-full bg-[#3bc177] w-5 h-5 flex items-center justify-center text-white text-[12px]">
                                1
                            </span>
                        </div>
                    </div>
                </div>
                {/* Header Sidebar */}

                {open && (
                    <div
                        className={`fixed w-full bg-[#0000005a] z-20 h-full top-0 left-0`}
                    >
                        <div className="fixed w-[60%] bg-white h-screen top-0 left-0">
                            <div className="w-full justify-between flex pr-3">
                                <div>
                                    <div className="relative mr-[15px]">
                                        <AiOutlineHeart size={30} className="mt-5 ml-3" />
                                        <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                            1
                                        </span>
                                    </div>
                                </div>
                                <RxCross1
                                    size={30}
                                    className="ml-4 mt-5"
                                    onClick={() => setOpen(false)}
                                />
                            </div>
                            <div className="my-8 w-[92%] m-auto h-[40px]">
                                <input
                                    type="search"
                                    placeholder="Search Product..."
                                    className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                {searchData && searchData.length !== 0 ? (
                                    <div className="absolute min-h-[30vh] bg-white shadow-lg z-10 p-4 w-full left-0 p-3">
                                        {searchData.map((i, index) => {
                                            const product_name = i.name.replace(/\s+/g, "-");
                                            return (
                                                <Link to={`/product/${product_name}`} key={index}>
                                                    <div className="w-full flex items-center py-3 hover:bg-gray-100 transition">
                                                        <img
                                                            src={`${backend_url}upload/${i.images[0]}`}
                                                            alt=""
                                                            className="w-10 h-10 mr-2.5"
                                                        />
                                                        <h1 className="text-sm">{i.name}</h1>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>

                            <Navbar active={activeHeading} />
                            <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                                <Link to="/seller">
                                    <h1 className="text-white flex items-center">
                                        Become a Seller <IoIosArrowForward className="ml-1" />
                                    </h1>
                                </Link>

                            </div> <br />
                            <br />
                            <br />
                            <div className="flex">
                                {
                                    <div className="flex justify-center w-full">
                                        {
                                            !isAuthenticated ? (
                                                <>
                                                    <Link to="/login" className="text-[18px] pr-[10px] text-[#000000b7]">
                                                        Login /
                                                    </Link>
                                                    <Link to="/sign-up" className="text-[18px] text-[#000000b7]">
                                                        SignUp
                                                    </Link>
                                                </>
                                            ) : (
                                                <div className="">
                                                    <Link to="/profile">
                                                        <img
                                                            src={`${backend_url}${user?.avatar}`}
                                                            alt=""
                                                            className="w-[60px] h-[60px] rounded-full border-[3px] border-[#0eae88]"
                                                        />
                                                    </Link>
                                                </div>
                                            )
                                        }
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                )}
            </div >
        </>
    );
};

export default Header;
