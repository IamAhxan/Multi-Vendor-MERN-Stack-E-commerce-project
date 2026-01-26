import React from "react";
import { AiOutlineCreditCard, AiOutlineLogout, AiOutlineMessage } from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { MdOutlineTrackChanges } from "react-icons/md"
import { TbAddressBook } from "react-icons/tb"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { toast } from "react-toastify";
import { server } from "../../server.js"

const ProfileSidebar = ({ active, setActive }) => {
    const navigate = useNavigate();


    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${server}/user/logout`, { withCredentials: true });
            toast.success(res.data.message);

            // Navigate first, then reload only if necessary to clear global state
            navigate("/login");
            window.location.reload();
        } catch (error) {
            const message = error.response?.data?.message || "Logout failed";
            console.log(message);
            toast.error(message);
        }
    };

    return (
        <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
            <div
                className="flex items-center !cursor-pointer w-full mb-8"
                onClick={() => setActive(1)}
            >
                <RxPerson size={20} color={active === 1 ? "red" : ""} />
                <span className={`pl-3 ${active === 1 ? "text-[red]" : ""} 800px:block hidden`}>
                    Profile
                </span>
            </div>
            <div
                className="flex items-center !cursor-pointer w-full mb-8"
                onClick={() => setActive(2)}
            >
                <HiOutlineShoppingBag size={20} color={active === 2 ? "red" : ""} />
                <span className={`pl-3 ${active === 2 ? "text-[red]" : ""} 800px:block hidden`}>
                    Orders
                </span>
            </div>
            <div
                className="flex items-center !cursor-pointer w-full mb-8"
                onClick={() => setActive(3)}
            >
                <HiOutlineReceiptRefund size={20} color={active === 3 ? "red" : ""} />
                <span className={`pl-3 ${active === 3 ? "text-[red]" : ""} 800px:block hidden`}>
                    Refunds
                </span>
            </div>
            <div className="flex items-center !cursor-pointer w-full mb-8" onClick={() => setActive(4) || navigate("/inbox")}>
                <AiOutlineMessage size={20} color={active === 4 ? "red" : ""} />
                <span className={`pl-3 ${active === 4 ? "text-[red]" : ""} 800px:block hidden`}>
                    Inbox</span>
            </div>
            <div className="flex items-center !cursor-pointer w-full mb-8" onClick={() => setActive(5)}>
                <MdOutlineTrackChanges size={20} color={active === 5 ? "red" : ""} />
                <span className={`pl-3 ${active === 5 ? "text-[red]" : ""} 800px:block hidden`}>
                    Track Order</span>
            </div>
            <div className="flex items-center !cursor-pointer w-full mb-8" onClick={() => setActive(6)}>
                <AiOutlineCreditCard size={20} color={active === 6 ? "red" : ""} />
                <span className={`pl-3 ${active === 6 ? "text-[red]" : ""} 800px:block hidden`}>
                    Payment Methods</span>
            </div>
            <div className="flex items-center !cursor-pointer w-full mb-8" onClick={() => setActive(7)}>
                <TbAddressBook size={20} color={active === 7 ? "red" : ""} />
                <span className={`pl-3 ${active === 7 ? "text-[red]" : ""} 800px:block hidden`}>
                    Address</span>
            </div>
            <div className="flex items-center !cursor-pointer w-full mb-8" onClick={() => setActive(8) || logoutHandler()}>
                <AiOutlineLogout size={20} color={active === 8 ? "red" : ""} />
                <span className={`pl-3 ${active === 8 ? "text-[red]" : ""} 800px:block hidden`}>
                    Logout</span>
            </div>

        </div>
    );
};

export default ProfileSidebar;
