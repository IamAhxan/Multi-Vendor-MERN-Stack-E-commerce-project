import React from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProductDetailsPage, ProfilePage, SellerCreatePage, SellerActivationPage, ShopLoginPage, ShopPage } from "./routes/Routes.js"
import { ShopDashboardPage, ShopCreateProduct } from "./routes/ShopRoutes.jsx"
import { ToastContainer, Bounce, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Store from './redux/store.js'
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { loadSeller, loadUser } from "./redux/actions/user";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.jsx";

function App() {
  Store.dispatch(loadUser())
  Store.dispatch(loadSeller())


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
        <Route path="/profile" element={<ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute>
          {/* <CheckoutPage /> */}
        </ProtectedRoute>} />
        <Route path="/shop-create" element={<SellerCreatePage />} />
        <Route path="/shop-login" element={<ShopLoginPage />} />

        <Route path="/shop/:id" element={<SellerProtectedRoute><ShopPage /></SellerProtectedRoute>} />
        <Route path="/dashboard" element={<SellerProtectedRoute><ShopDashboardPage /></SellerProtectedRoute>} />
        <Route path="/dashboard-create-product" element={<SellerProtectedRoute><ShopCreateProduct /></SellerProtectedRoute>} />

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
