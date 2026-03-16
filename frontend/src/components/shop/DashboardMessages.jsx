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
import socketIO from 'socket.io-client'
const ENDPOINT = "http://localhost:4000"
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })
const DashboardMessages = () => {
    const { seller } = useSelector((state) => state.seller);
    const [conversations, setConversations] = useState([])
    const [open, setOpen] = useState(false)
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [messages, setMessages] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [newMessage, setNewMessage] = useState("")
    const sellerId = seller._id;

    useEffect(() => {
        socketId.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage, conversations])



    useEffect(() => {
        const messageList = axios.get(`${server}/conversation/get-all-conversation-seller/${sellerId}`, {
            withCredentials: true,
        }).then((res) => {
            setConversations(res.data.conversations)
        }).catch((error) => {
            toast.error(error.response.data.message);
        })
    }, [seller])


    const sendMessageHandler = async (e) => {
        e.preventDefault();
        console.log("send message")
        const message = {
            sender: seller._id,
            text: newMessage,
            conversationId: currentChat._id,
        };
        const receiverId = currentChat.members.find((member) => member.id !== seller._id);
        socketId.emit("sendMessage", {
            senderId: seller._id,
            text: newMessage,
            receiverId: receiverId,
        });

        try {
            if (newMessage !== "") {
                await axios.post(`${server}/message/create-new-message`, message, {
                    withCredentials: true,
                }).then((res) => {
                    setMessages([...messages, res.data.message])
                    setNewMessage("")
                }).catch((error) => {
                    toast.error(error.response.data.message);
                    console.log(error)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='w-[90%] bg-white m-3 h-[85vh] overflow-y-scroll rounded'>


            {
                !open && (
                    <>
                        <h1 className='text-center text-[30px] font-poppins py-3'>All Messages</h1>
                        {/* All Messages List */}
                        {
                            conversations && conversations.map((item, index) => {
                                return <MessageList key={index} data={item} index={index} open={open} setOpen={setOpen} setCurrentChat={setCurrentChat} />
                            })
                        }
                    </>
                )}
            {
                open && (
                    <SellerInbox setOpen={setOpen} newMessage={newMessage} setNewMessage={setNewMessage} sendMessageHandler={sendMessageHandler} />
                )
            }


        </div>
    )
}


const MessageList = ({ data, index, setOpen, setCurrentChat }) => {

    const navigate = useNavigate()
    const [active, setActive] = useState(0)



    const handleClick = (id) => {
        navigate(`?${id}`)
        setOpen(true)
    }

    return (
        <div className={`w-full flex p-3 px-3 ${active === index ? 'bg-[#00000010]' : "bg-transparent"} cursor-pointer`} onClick={(e) =>
            setActive(index) ||
            handleClick(data._id) || setCurrentChat(data)}  >
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


const SellerInbox = ({ setOpen, newMessage, setNewMessage, sendMessageHandler }) => {

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

            <form aria-required={true} className='p-3 relative flex justify-between items-center justify-center' onSubmit={sendMessageHandler}>
                <div className="w-[3%]">
                    <TfiGallery size={20} className='cursor-pointer' />
                </div>
                <div className="w-[95%]">
                    <input type="text" required placeholder='Type a message...' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className={`${styles.input}`} />
                    <input type="submit" value="Send" className={`hidden`} id='send' />
                    <label htmlFor="send">
                        <AiOutlineSend size={20} className='absolute right-8 top-5 cursor-pointer' />
                    </label>
                </div>
            </form>
        </div>
    )
}


export default DashboardMessages