import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // Get auth state from your Redux store
    // Ensure "user" matches whatever you named your slice in store.js
    const { isAuthenticated, loading } = useSelector((state) => state.user);

    // 1. If we are still fetching user data, show nothing or a loader
    if (loading === false) {
        if (!isAuthenticated) {
            return <Navigate to="/login" replace />;
        }
    }

    // 2. If the request finished and the user isn't logged in, redirect


    // 3. If logged in, show the protected content
    return children;
};

export default ProtectedRoute;