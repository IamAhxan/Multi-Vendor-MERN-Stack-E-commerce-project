import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { server } from '../../server'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai'
import { TfiGallery } from 'react-icons/tfi'
import styles from '../../styles/styles'

const DashboardMessages = () => {
    const { seller } = useSelector((state) => state.seller);
    const [conversations, setConversations] = useState([])
    const [open, setOpen] = useState(false)
    const sellerId = seller._id;





    useEffect(() => {
        const messageList = axios.get(`${server}/conversation/get-all-conversation-seller/${sellerId}`, {
            withCredentials: true,
        }).then((res) => {
            setConversations(res.data.conversations)
        }).catch((error) => {
            toast.error(error.response.data.message);
        })
    }, [seller])


    return (
        <div className='w-[90%] bg-white m-3 h-[85vh] overflow-y-scroll rounded'>


            {
                !open && (
                    <>
                        <h1 className='text-center text-[30px] font-poppins py-3'>All Messages</h1>
                        {/* All Messages List */}
                        {
                            conversations && conversations.map((item, index) => {
                                return <MessageList key={index} data={item} index={index} open={open} setOpen={setOpen} />
                            })
                        }
                    </>
                )}
            {
                open && (
                    <SellerInbox setOpen={setOpen} />
                )
            }


        </div>
    )
}


const MessageList = ({ data, index, setOpen }) => {

    const navigate = useNavigate()
    const [active, setActive] = useState(0)



    const handleClick = (id) => {
        navigate(`?${id}`)
        setOpen(true)
    }

    return (
        <div className={`w-full flex p-3 px-3 ${active === index ? 'bg-[#00000010]' : "bg-transparent"} cursor-pointer`} onClick={(e) =>
            setActive(index) ||
            handleClick(data._id)} >
            <div className="relative">
                <img src="http://localhost:3000/upload/1772282961145.jpg" alt="" className="w-[50px] h-[50px] rounded-full" />
                <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]"></div>
            </div>
            <div className="pl-3">
                <h1 className=' text-[18px] '>Ahsan</h1>
                <p className='  text-[16px] text-[#000c]'>You: Lorem ipsum, dolor sit ...</p>
            </div>
        </div >
    )

}


const SellerInbox = ({ setOpen }) => {
    return (
        <div className='w-full min-h-full flex flex-col justify-between'>
            {/* Message Header */}
            <div className="w-full flex p-3 items-center justify-between bg-slate-200">
                <div className="flex">
                    <img src="http://localhost:3000/upload/1772282961145.jpg" alt="" className="w-[60px] h-[60px] rounded-full" />
                    <div className="pl-3">
                        <h1 className="text-[18px] font-[600]">Ahsan</h1>
                        <h1>Active Now</h1>
                    </div>
                </div>
                <AiOutlineArrowRight size={20} onClick={() => setOpen(false)} className='cursor-pointer' />

            </div>

            {/* Messages */}
            <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
                <div className="flex w-full my-2">
                    <img src="http://localhost:3000/upload/1772282961145.jpg" alt="" className='w-[40px] h-[40px] rounded-full mr-3' />

                    <div className="w-max bg-[#38c776] text-white h-min p-2 rounded">
                        <p>Hello There</p>
                    </div>
                </div>
                <div className="flex w-full justify-end my-2">
                    <div className="w-max bg-[#38c776] text-white h-min p-2 rounded">
                        <p>Hi </p>
                    </div>
                </div>
            </div>






            {/* Send Message Input */}

            <form aria-required={true} className='p-3 relative flex justify-between items-center justify-center'>
                <div className="w-[3%]">
                    <TfiGallery size={20} className='cursor-pointer' />
                </div>
                <div className="w-[95%]">
                    <input type="text" required placeholder='Type a message...' className={`${styles.input}`} />
                    <input type="submit" value="Send" className={`hidden`} id='send' />
                    <label htmlFor="send ">
                        <AiOutlineSend size={20} className='absolute right-8 top-5 cursor-pointer' />
                    </label>
                </div>
            </form>
        </div>
    )
}


export default DashboardMessages