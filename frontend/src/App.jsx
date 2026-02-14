import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProductDetailsPage, ProfilePage, SellerCreatePage, SellerActivationPage, ShopLoginPage, ShopPage } from "./routes/Routes.js"
import { ShopDashboardPage, ShopCreateProduct, ShopAllProducts, ShopCreateEvents, ShopAllEvents, ShopAllCoupouns } from "./routes/ShopRoutes.jsx"
import { ToastContainer, Bounce, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Store from './redux/store.js'
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import { loadSeller, loadUser } from "./redux/actions/user";
import SellerProtectedRoute from "./routes/SellerProtectedRoute.jsx";
import ShopPreviewPage from "./pages/Shop/ShopPreviewPage.jsx";
import { getAllProducts } from "./redux/actions/product.js";
import { getAllEvents } from "./redux/actions/event.js";

function App() {
  useEffect(() => {
    Store.dispatch(loadUser())
    Store.dispatch(loadSeller())
    Store.dispatch(getAllProducts())
    Store.dispatch(getAllEvents())
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
        <Route path="/dashboard-products" element={<SellerProtectedRoute><ShopAllProducts /></SellerProtectedRoute>} />
        <Route path="/dashboard-create-event" element={<SellerProtectedRoute><ShopCreateEvents /></SellerProtectedRoute>} />
        <Route path="/dashboard-events" element={<SellerProtectedRoute><ShopAllEvents /></SellerProtectedRoute>} />
        <Route path="/dashboard-coupouns" element={<SellerProtectedRoute><ShopAllCoupouns /></SellerProtectedRoute>} />
        <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />

      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        style={{ zIndex: 999999 }}
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
