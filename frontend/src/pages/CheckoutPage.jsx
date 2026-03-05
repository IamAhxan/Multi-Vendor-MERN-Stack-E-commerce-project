import React from 'react'
import Header from '../components/Layout/Header/Header'
import Footer from '../components/Layout/Footer'
import Checkout from '../components/Checkout/Checkout.jsx'
import CheckoutSteps from '../components/Checkout/CheckoutSteps.jsx'

const CheckoutPage = () => {
    return (
        <div>
            <Header />
            <br />
            <br />
            <CheckoutSteps active={1} />
            <Checkout />
            <br />
            <br />
            <Footer />
        </div>
    )
}

export default CheckoutPage