import React, { useEffect, useState } from 'react'
import { productData } from '../../../static/data'
import styles from '../../../styles/styles'
import ProductCard from '../ProductCard/ProductCard.jsx'
import { useSelector } from 'react-redux'
import Loader from '../../Layout/Loader.jsx'

const BestDeals = () => {
    const [data, setData] = useState([])
    const { allProducts, isLoading } = useSelector((state) => state.products);


    useEffect(() => {
        const allProductsData = [...allProducts]
        const sortedData = allProductsData.sort((a, b) => b.sold_out - a.sold_out);
        // Only run logic if products exists and is an array

        const firstFive = sortedData && sortedData.slice(0, 5);
        setData(firstFive);

    }, [allProducts]);
    if (isLoading) return <div><Loader /></div>;

    return (
        <div>
            <div className={`${styles.section}`}>
                <div className={`${styles.heading}`}>
                    <h1>Best Deals</h1>
                </div>
                <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 gap-[30px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
                    {/* ... your existing JSX ... */}
                    {data && data.length > 0 ? (
                        data.map((i, index) => <ProductCard data={i} key={index} />)
                    ) : (
                        <p>No products found. Check if your API is returning data!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BestDeals