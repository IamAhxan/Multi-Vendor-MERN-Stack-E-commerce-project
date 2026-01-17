import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header/Header'
import styles from '../styles/styles'
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/Route/ProductCard/ProductCard';
import { productData } from '../static/data';

const ProductsPage = () => {
    const [data, setData] = useState([]);
    const [searchParams] = useSearchParams()
    const categoryData = searchParams.get("category")

    useEffect(() => {
        if (categoryData === null) {
            const d = productData && productData.sort((a, b) => a.total_sell - b.total_sell)
            setData(d)
        } else {
            const d = productData && productData.filter((i) => i.category === categoryData)
            setData(d)
        }
    })

    return (
        <div>
            <Header activeHeading={3} />
            <br />
            <br />
            <div className={`${styles.section}`}>
                <div className="grid grid-cols1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] x;Lgrid-cols-5 xl:gap-[30px] mb-12">
                    {
                        data && data.map((i, index) => (
                            <ProductCard data={i} key={index} />
                        ))
                    }
                    {
                        data && data.length === 0 ? (
                            <h1 className='text-center w-full pb-]100px] text-[20px]'>No Products Found</h1>
                        ) : null
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductsPage