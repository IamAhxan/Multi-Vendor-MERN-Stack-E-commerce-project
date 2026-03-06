import React from 'react'
import Payment from "../components/Payment/Payment.jsx"
import Header from '../components/Layout/Header/Header.jsx'
import CheckoutSteps from '../components/Checkout/CheckoutSteps.jsx'
import Footer from '../components/Layout/Footer.jsx'

const PaymentPage = () => {
    return (
        <div>
            <Header />
            <br />
            <br />
            <CheckoutSteps active={2} />
            <Payment />
            <br />
            <br />
            <Footer />
        </div>
    )
}

export default PaymentPage