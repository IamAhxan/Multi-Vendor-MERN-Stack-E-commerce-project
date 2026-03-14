import React from "react";
import Header from "../../components/Layout/Header/Header";
import Footer from "../../components/Layout/Footer";
import ShopSettings from "../../components/shop/ShopSettings.jsx";

const ShopSettingsPage = () => {
    return (
        <div>
            <Header />
            <ShopSettings />
            <Footer />
        </div>
    );
};

export default ShopSettingsPage;
