import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../redux/actions/product';
import Header from '../components/Layout/Header/Header';
import Footer from '../components/Layout/Footer';
import ProductDetails from "../components/products/ProductDetails.jsx";
import SuggestedProduct from "../components/products/SuggestedProduct.jsx";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { allProducts, isLoading } = useSelector((state) => state.products);
    const { allEvents } = useSelector((state) => state.events);
    const [data, setData] = useState(null);
    const [searchParams] = useSearchParams();
    const eventData = searchParams.get("isEvent");



    useEffect(() => {
        dispatch(getAllProducts());
        scrollTo(0, 0);
    }, [dispatch]);

    useEffect(() => {
        // if (allProducts && allProducts.length > 0) {
        //     // Use .find() to match the ID from the URL with the ID in your DB
        //     // Note: If 'id' from the URL is a string and 'i._id' is also a string, use ===
        //     const product = allProducts.find((i) => i._id === id);

        //     setData(product);
        // }

        if (eventData !== null) {
            const product = allEvents.find((i) => i._id === id);
            setData(product);
        } else {
            const product = allProducts.find((i) => i._id === id);
            setData(product);
        }


    }, [allProducts, allEvents, id, data]); // Depend on 'id' instead of 'name'

    // Updated Debug Logs
    // useEffect(() => {
    //     if (allProducts) {
    //         console.log("Looking for ID:", id);
    //         console.log("Total products loaded:", allProducts.length);
    //         console.log("Match found:", allProducts.find((i) => i._id === id) ? "Yes" : "No");
    //     }
    // }, [allProducts, id]);

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