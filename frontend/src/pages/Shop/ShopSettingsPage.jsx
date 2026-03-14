import React from "react";
import ShopSettings from "../../components/shop/ShopSettings.jsx";
import DashboardHeader from "../../components/shop/Layout/DashboardHeader.jsx";
import DashboardSideBar from "../../components/shop/Layout/DashboardSideBar.jsx";

const ShopSettingsPage = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex items-start justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={11} />
                </div>
                <ShopSettings />
            </div>
        </div>
    );
};

export default ShopSettingsPage;
