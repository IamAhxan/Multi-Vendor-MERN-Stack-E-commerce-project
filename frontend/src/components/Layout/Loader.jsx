import React from 'react'
import animationData from "../../assets/EcommerceAnimation.json"
import Lottie from 'react-lottie';

const Loader = () => {
    const defaultOptions = {
        loop: false,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };
    return (
        <div className='w-full h-screen flex items-center justify-center'>
            <Lottie options={defaultOptions} width={300} height={300} />
        </div>
    )
}

export default Loader