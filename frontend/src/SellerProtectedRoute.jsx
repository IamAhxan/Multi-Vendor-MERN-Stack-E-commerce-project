import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";// Optional

const SellerProtectedRoute = ({ children }) => {
    const { isLoading, isAuthenticated, seller } = useSelector((state) => state.seller);

    // 1. Wait for the API call to finish
    if (isLoading) {
        return <p>Loading...</p>;
    }

    // 2. If not authenticated, send them to the shop login page
    if (!isAuthenticated) {
        return <Navigate to="/shop-login" replace />;
    }

    // 3. If authenticated, render the children (the protected page)
    return children;
};

export default SellerProtectedRoute;