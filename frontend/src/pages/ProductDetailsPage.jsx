import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../redux/actions/product';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer';
import ProductDetails from "../components/products/ProductDetails.jsx";
import SuggestedProduct from "../components/products/SuggestedProduct.jsx";

const ProductDetailsPage = () => {
    const { name } = useParams();
    const dispatch = useDispatch();
    const { allProducts, isLoading } = useSelector((state) => state.products);
    const [data, setData] = useState(null);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            // Normalize the URL name: replace hyphens with spaces and trim
            const productNameFromUrl = name.replace(/-/g, " ").toLowerCase().trim();

            const product = allProducts.find((i) => {
                // Normalize the Database name: remove extra spaces and trim
                const nameFromDb = i.name.toLowerCase().trim();
                return nameFromDb === productNameFromUrl;
            });

            setData(product);
        }
    }, [allProducts, name]);

    // DEBUG LOGS - Check your browser console!
    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            console.log("1. URL Param Name:", name);
            console.log("2. Target Name (Normalized):", name.replace(/-/g, " ").toLowerCase().trim());
            console.log("3. First product in DB:", allProducts[0]?.name);
        }
    }, [allProducts, name]);

    return (
        <div>
            <Header />
            {isLoading ? (
                <div className="flex justify-center items-center h-[50vh]">
                    <p>Loading Product...</p>
                </div>
            ) : (
                <>
                    {data ? (
                        <>
                            <ProductDetails data={data} />
                            <SuggestedProduct data={data} />
                        </>
                    ) : (
                        <div className="flex flex-col justify-center items-center h-[50vh]">
                            <h2 className="text-[20px] font-[600]">Product not found!</h2>
                            <p className="text-gray-500">Searching for: "{name.replace(/-/g, " ")}"</p>
                            <button
                                onClick={() => console.log("Current Products in Redux:", products)}
                                className="mt-4 bg-teal-500 text-white px-4 py-2 rounded"
                            >
                                Log Products to Console
                            </button>
                        </div>
                    )}
                </>
            )}
            <Footer />
        </div>
    );
};

export default ProductDetailsPage;