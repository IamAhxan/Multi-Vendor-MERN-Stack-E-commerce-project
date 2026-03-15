import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage,
  BestSellingPage, EventsPage, FAQPage, ProductDetailsPage,
  ProfilePage, SellerCreatePage, SellerActivationPage,
  ShopLoginPage, ShopPage, CheckoutPage, PaymentPage, OrderSuccessPage, OrderDetailsPage, TrackOrderPage, ShopAllRefunds
} from "./routes/Routes.js";
import {
  ShopDashboardPage, ShopCreateProduct, ShopAllProducts,
  ShopCreateEvents, ShopAllEvents, ShopAllCoupouns, ShopAllOrders, ShopOrderDetails, ShopSettingsPage, ShopWithdrawMoneyPage, ShopInboxPage
} from "./routes/ShopRoutes.jsx";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Store from './redux/store.js';
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { loadSeller, loadUser } from "./redux/actions/user";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.jsx";
import ShopPreviewPage from "./pages/Shop/ShopPreviewPage.jsx";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";
import { server } from "./server.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  // Fetch Stripe Publishable Key from Backend
  async function getStripeApiKey() {
    try {
      const { data } = await axios.get(`${server}/payment/stripeapikey`, { withCredentials: true });
      // Matches backend key: 'stripeapikey'
      setStripeApiKey(data.stripeapikey);
    } catch (error) {
      console.error("Error fetching Stripe Key:", error);
    }
  }

  useEffect(() => {
    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApiKey();
  }, []);

  return (
    <BrowserRouter>
      {/* 1. Global Loader for Payment Route */}
      {window.location.pathname === "/payment" && !stripeApiKey ? (
        <div className="w-full h-screen flex items-center justify-center">
          <h1 className="text-2xl font-[600]">Loading Payment Gateway...</h1>
        </div>
      ) : (
        <Routes>
          {/* Static Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
          <Route path="/activation/:activation_token" element={<ActivationPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order/success" element={<OrderSuccessPage />} />

          {/* 2. Stripe Payment Route Wrapped in Elements */}
          {stripeApiKey && (
            <Route
              path="/payment"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  {/* <ProtectedRoute> */}
                  <PaymentPage />
                  {/* </ProtectedRoute> */}
                </Elements>
              }
            />
          )}

          {/* Protected User Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/user/order/:id" element={
            <ProtectedRoute>
              <OrderDetailsPage />
            </ProtectedRoute>
          } />
          <Route path="/user/track/order/:id" element={
            <ProtectedRoute>
              <TrackOrderPage />
            </ProtectedRoute>
          } />

          {/* Seller / Shop Routes */}
          <Route path="/shop-create" element={<SellerCreatePage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route path="/shop/:id" element={<SellerProtectedRoute><ShopPage /></SellerProtectedRoute>} />
          <Route path="/settings" element={<SellerProtectedRoute><ShopSettingsPage /></SellerProtectedRoute>} />
          <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />} />
          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<SellerProtectedRoute><ShopDashboardPage /></SellerProtectedRoute>} />
          <Route path="/dashboard-create-product" element={<SellerProtectedRoute><ShopCreateProduct /></SellerProtectedRoute>} />
          <Route path="/dashboard-products" element={<SellerProtectedRoute><ShopAllProducts /></SellerProtectedRoute>} />
          <Route path="/dashboard-orders" element={<SellerProtectedRoute><ShopAllOrders /></SellerProtectedRoute>} />
          <Route path="/order/:id" element={<SellerProtectedRoute><ShopOrderDetails /></SellerProtectedRoute>} />
          <Route path="/dashboard-create-event" element={<SellerProtectedRoute><ShopCreateEvents /></SellerProtectedRoute>} />
          <Route path="/dashboard-events" element={<SellerProtectedRoute><ShopAllEvents /></SellerProtectedRoute>} />
          <Route path="/dashboard-coupouns" element={<SellerProtectedRoute><ShopAllCoupouns /></SellerProtectedRoute>} />
          <Route path="/dashboard-withdraw-money" element={<SellerProtectedRoute><ShopWithdrawMoneyPage /></SellerProtectedRoute>} />
          <Route path="/dashboard-refunds" element={<SellerProtectedRoute><ShopAllRefunds /></SellerProtectedRoute>} />
          <Route path="/dashboard-messages" element={<SellerProtectedRoute><ShopInboxPage /></SellerProtectedRoute>} />
        </Routes>
      )}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        style={{ zIndex: 999999 }}
      />
    </BrowserRouter>
  );
}

export default App;