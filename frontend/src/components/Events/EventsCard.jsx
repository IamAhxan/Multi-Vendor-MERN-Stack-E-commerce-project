import React from 'react'
import styles from '../../styles/styles'
import CountDown from "./CountDown.jsx"
import { backend_url } from '../../server.js'

const EventsCard = ({ active, data }) => {
    return (
        <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2 mb-12`}>
            <div className="w-full lg:w-[50%] m-auto">
                <img src={`${backend_url}upload/${data.images[0]}`} alt="" />
            </div>
            <div className="w-full lg:[w-50%] flex flex-col justify-center">
                <h2 className={`${styles.productTitle}`}>{data.name}</h2>
                <p>{data.description}</p>
                <div className="flex py-2 justify-between">
                    <div className="flex">
                        <h5 className="font-[50] text-[18px] text-[#d55d45] pr-3 line-through">
                            {data.originalPrice}$
                        </h5>
                        <h5 className='font-bold text-[20px] text-[#333] font-roboto'>{data.discountPrice}$</h5>
                    </div>
                    <span className='pr-3 font-400 text-[17px] text-[#44a55e]'>120 Sold</span>
                </div>
                <CountDown data={data} />
            </div>
        </div>
    )
}

export default EventsCard