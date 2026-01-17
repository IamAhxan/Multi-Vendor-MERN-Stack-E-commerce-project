import React from 'react'
import styles from '../../styles/styles'
import CountDown from "./CountDown.jsx"

const EventsCard = ({ active }) => {
    return (
        <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2 mb-12`}>
            <div className="w-full lg:w-[50%] m-auto">
                <img src="https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg" alt="" />
            </div>
            <div className="w-full lg:[w-50%] flex flex-col justify-center">
                <h2 className={`${styles.productTitle}`}>IPhone 14 Pro Max 8/256GB</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis accusantium nulla quae recusandae tempore exercitationem perspiciatis porro! Voluptatem quos accusamus quia, dolorum nesciunt laudantium dicta, sed suscipit autem porro necessitatibus amet ipsa modi facilis omnis inventore minus tempora quaerat ullam beatae a qui! Porro optio reprehenderit temporibus voluptatibus unde quaerat, harum pariatur expedita amet qui quisquam atque eos fugiat cupiditate. Beatae, ex? Repellendus magnam tempora praesentium! Minus, iste fugiat sequi porro beatae mollitia. Illum laborum non porro rem veritatis, aperiam, accusamus expedita maxime animi eius nesciunt unde molestias quos repellendus assumenda inventore vitae provident commodi libero! Molestias itaque corrupti perferendis.</p>
                <div className="flex py-2 justify-between">
                    <div className="flex">
                        <h5 className="font-[50] text-[18px] text-[#d55d45] pr-3 line-through">
                            1099$
                        </h5>
                        <h5 className='font-bold text-[20px] text-[#333] font-roboto'>999$</h5>
                    </div>
                    <span className='pr-3 font-400 text-[17px] text-[#44a55e]'>120 Sold</span>
                </div>
                <CountDown />
            </div>
        </div>
    )
}

export default EventsCard