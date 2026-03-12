import React from 'react'
import DashboardHeader from "../../components/shop/Layout/DashboardHeader.jsx"
import DashboardSideBar from "../../components/shop/Layout/DashboardSideBar.jsx"
import DashboardHero from "../../components/shop/DashboardHero.jsx"
const ShopDashboardPage = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex items-start justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={1} />
                </div>
                <DashboardHero />
            </div>
        </div>
    )
}

export default ShopDashboardPage