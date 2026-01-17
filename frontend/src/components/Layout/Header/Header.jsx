import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Fixed: removed unused 'Links'
import styles from "./../../../styles/styles.js";
import { productData, categoriesData } from "../../../static/data.jsx";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from 'react-icons/cg';
import DropDown from './DropDown.jsx';
import Navbar from './Navbar.jsx';
import { useSelector } from 'react-redux';
import { backend_url } from "../../../server.js";

const Header = ({ activeHeading }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchData, setSearchData] = useState(null);
    const [active, setActive] = useState(false);
    const [dropDown, setDropDown] = useState(false);

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
            const filteredProduct = productData && productData.filter((product) => {
                return product.name.toLowerCase().includes(term.toLowerCase());
            });
            setSearchData(filteredProduct);
        }
    };

    return (<>
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
                                                src={i.image_Url[0].url}
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
                    <Link to="/seller">
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
            <div className={`${styles.section} ${styles.normalFlex} justify-between w-[90%]`}>
                {/* Categories Dropdown Wrapper */}
                <div className="relative h-15 mt-2.5 w-67.5 hidden 1000px:block">
                    <BiMenuAltLeft size={30} className="absolute top-3 left-2 z-10" />
                    <button
                        onClick={() => setDropDown(!dropDown)}
                        className="h-full w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-medium select-none rounded-t-md relative"
                    >
                        All Categories
                    </button>
                    <IoIosArrowDown
                        size={20}
                        className="absolute right-2 top-4 cursor-pointer"
                        onClick={() => setDropDown(!dropDown)}
                    />
                    {dropDown ? (
                        <DropDown
                            categoriesData={categoriesData}
                            setDropDown={setDropDown}
                        />
                    ) : null}
                </div>

                {/* Navbar Component */}
                <div className={`${styles.normalFlex}`}>
                    <Navbar active={activeHeading} />
                </div>

                <div className="flex">
                    <div className={`${styles.normalFlex}`}>
                        <div className="relative cursor-pointer mr-3.75">
                            <AiOutlineHeart
                                size={30}
                                color="rgb(255 255 255 /83%)" />
                            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">0</span>
                        </div>
                    </div>
                    <div className={`${styles.normalFlex}`}>
                        <div className="relative cursor-pointer mr-3.75">
                            <AiOutlineShoppingCart
                                size={30}
                                color="rgb(255 255 255 /83%)" />
                            <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">1</span>
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
                </div>
            </div>
        </div>
    </>

    )
}


export default Header;