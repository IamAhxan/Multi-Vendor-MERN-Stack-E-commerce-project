import React, { useEffect } from 'react'
import Header from './../components/Layout/Header/Header.jsx'
import Hero from './../components/Route/Hero/Hero.jsx'
import Categories from '../components/Route/Categories/Categories.jsx'
import BestDeals from '../components/Route/BestDeals/BestDeals.jsx'
import FeaturedProduct from './../components/Route/FeaturedProduct/FeaturedProduct.jsx'
import Events from '../components/Events/Events.jsx'
import Sponsored from "../components/Route/Sponsored.jsx"
import Footer from './../components/Layout/Footer.jsx'
import { useDispatch } from 'react-redux'
import { getAllProducts, getAllProductsShop } from '../redux/actions/product.js'


const HomePage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // This triggers the 'isLoading = true' and then 'Success'
        dispatch(getAllProducts());
    }, [dispatch]);
    return (
        <div>
            <Header activeHeading={1} />
            <Hero />
            <Categories />
            <BestDeals />
            <Events />
            <FeaturedProduct />
            <Sponsored />
            <Footer />
        </div>
    )
}

export default HomePage