import React, { useEffect, useState } from 'react'
import Header from '../components/Layout/Header/Header'
import Footer from '../components/Layout/Footer'
import ProductDetails from "../components/products/ProductDetails.jsx"
import SuggestedProduct from "../components/products/SuggestedProduct.jsx"
import { useParams } from 'react-router-dom'
import { productData } from '../static/data.jsx'

const ProductDetailsPage = () => {
    const { name } = useParams()
    const [data, setData] = useState()
    const productName = name.replace(/-/g, " ");
    useEffect(() => {
        const data = productData.find((i) => i.name === productName);
        setData(data)
    }, [])

    return (
        <div>
            <Header />
            <ProductDetails data={data} />
            {
                data && <SuggestedProduct data={data} />
            }
            <Footer />
        </div>
    )
}

export default ProductDetailsPage