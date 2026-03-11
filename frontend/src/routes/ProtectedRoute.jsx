import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector((state) => state.user);

    // 1. IMPORTANT: If loading is true, wait. 
    // Do not let the code reach "return children" yet.
    if (loading) {
        return (
            <Loader />
        );
    }

    // 2. Once loading is false, check authentication
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 3. Only if loading is false AND isAuthenticated is true
    return children;
};

export default ProtectedRoute;