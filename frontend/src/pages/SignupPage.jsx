import React, { useEffect } from 'react'
import Signup from './../components/Signup.jsx'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const SignupPage = () => {
    const { isAuthenticated, user } = useSelector((state) => state.user)
    const navigate = useNavigate()
    useEffect(() => {
        if (isAuthenticated === true) {
            navigate("/")
        }
    }, [isAuthenticated])
    return (
        <div>
            <Signup />
        </div>
    )
}

export default SignupPage