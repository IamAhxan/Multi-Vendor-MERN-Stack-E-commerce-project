import React, { useEffect } from 'react'
import ShopLogin from "./../components/shop/ShopLogin.jsx"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ShopLoginPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated, seller, isLoading } = useSelector((state) => state.seller)

    useEffect(() => {
        if (isAuthenticated === true) {
            navigate(`/dashboard`)
        }
    }, [isAuthenticated, isLoading])
    return (
        <div>
            <ShopLogin />
        </div>
    )
}

export default ShopLoginPage