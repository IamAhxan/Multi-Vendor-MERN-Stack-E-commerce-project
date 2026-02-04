import React from "react"
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProductDetailsPage, ProfilePage, SellerCreatePage, SellerActivationPage, ShopLoginPage, ShopPage } from "./Routes.js"
import { ToastContainer, Bounce, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import Store from './redux/store.js'
import ProtectedRoute from "./ProtectedRoute.jsx";
import { useSelector } from "react-redux";
import { loadSeller, loadUser } from "./redux/actions/user";
import SellerProtectedRoute from "./SellerProtectedRoute.jsx";

function App() {
  const { loading, isAuthenticated } = useSelector((state) => state.user)
  const { isSeller, seller } = useSelector((state) => state.seller)
  useEffect(() => {
    Store.dispatch(loadUser())
    Store.dispatch(loadSeller())

    if (isSeller) {
      <Navigate to={`/seller/${seller._id}`} />
    }
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />} />
        <Route path="/activation/:activation_token" element={<ActivationPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:name" element={<ProductDetailsPage />} />
        <Route path="/best-selling" element={<BestSellingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}>
          <ProfilePage />
        </ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute isAuthenticated={isAuthenticated}>
          {/* <CheckoutPage /> */}
        </ProtectedRoute>} />
        <Route path="/shop-create" element={<SellerCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />

        <Route path="/shop" element={<SellerProtectedRoute><ShopPage /></SellerProtectedRoute>} />

      </Routes>
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
      />
    </BrowserRouter>
  )
}

export default App
