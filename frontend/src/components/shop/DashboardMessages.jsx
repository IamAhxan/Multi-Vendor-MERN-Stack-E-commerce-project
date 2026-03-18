import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { backend_url, server } from '../../server'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai'
import { TfiGallery } from 'react-icons/tfi'
import styles from '../../styles/styles'
import socketIO from 'socket.io-client'
import { format } from 'timeago.js'
import Loader from '../Layout/Loader'
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
    const [sellerInboxUser, setSellerInboxUser] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [activeStatus, setActiveStatus] = useState(false)

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


    useEffect(() => {
        if (seller) {
            const userId = seller?._id;
            socketId.emit("addUser", userId);
            socketId.on("getUsers", (users) => {
                setOnlineUsers(users)
            })
        }
    }, [seller])

    const onlineCheck = (chat) => {
        const chatMembers = chat.members.find((member) => member !== seller?._id)
        const online = onlineUsers.find((user) => user.userId === chatMembers)


        // setActiveStatus(online ? true : false)

        return online ? true : false
    }
    // get Messages
    useEffect(() => {
        const getMessages = async () => {

            try {
                const response = await axios.get(`${server}/message/get-all-messages/${currentChat._id}`, {
                    withCredentials: true,
                })
                setMessages(response.data.messages)
            } catch (error) {
                toast.error(error.response.data.message);
                console.log(error)
            }
        }
        if (currentChat) { getMessages() }
    }, [currentChat])

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
                    updateLastMessage()
                }).catch((error) => {
                    toast.error(error.response.data.message);
                    console.log(error)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateLastMessage = async () => {
        socketId.emit("updateLastMessage", {
            lastMessage: newMessage,
            lastMessageId: seller._id,
        })

        await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
            lastMessage: newMessage,
            lastMessageId: seller._id,
        }).then((res) => {
            console.log(res.data.conversation)
            setNewMessage("")
        }).catch((error) => {
            toast.error(error.response.data.message);
            console.log(error)
        })
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
                                return <MessageList key={index} setActiveStatus={setActiveStatus} online={onlineCheck(item)} setSellerInboxUser={setSellerInboxUser} data={item} index={index} open={open} setOpen={setOpen} setCurrentChat={setCurrentChat} me={seller._id} />
                            })
                        }
                    </>
                )}
            {
                open && (
                    <SellerInbox userData={sellerInboxUser} setOpen={setOpen} newMessage={newMessage} setNewMessage={setNewMessage} sendMessageHandler={sendMessageHandler} messages={messages} sellerId={sellerId} activeStatus={activeStatus} />
                )
            }


        </div>
    )
}


const MessageList = ({ data, index, setOpen, setCurrentChat, me, setSellerInboxUser, online, setActiveStatus }) => {

    const navigate = useNavigate()
    const [active, setActive] = useState(0)
    const [userData, setUserData] = useState(null)



    useEffect(() => {
        setActiveStatus(online)
        const userId = data.members.find((user) => user !== me)

        const getUser = async () => {
            try {
                const res = await axios.get(`${server}/user/user-info/${userId}`);
                setUserData(res.data.user)
                setSellerInboxUser(userData)

            } catch (error) {
                console.log(error)
                toast.error(error.response.data.message);
            }
        }
        getUser()
    }, [me, data])

    const handleClick = (id) => {
        navigate(`?${id}`)
        setOpen(true)
    }



    if (!userData) return (
        <Loader />
    );
    return (
        <div className={`w-full flex p-3 px-3 ${active === index ? 'bg-[#00000010]' : "bg-transparent"} cursor-pointer`} onClick={(e) =>
            setActive(index) ||
            handleClick(data._id) || setCurrentChat(data)}  >
            <div className="relative">
                <img src={`${backend_url}upload/${userData?.avatar}`} alt="" className="w-[50px] h-[50px] rounded-full" />
                {
                    online ? (
                        <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]"></div>
                    ) : (
                        <div className="w-[12px] h-[12px] bg-red-500 rounded-full absolute top-[2px] right-[2px]"></div>
                    )
                }
            </div>
            <div className="pl-3">
                <h1 className='text-[18px]'>{userData.name}</h1>
                <p className='  text-[16px] text-[#000c]'>{data.lastMessageId !== userData._id ? "You:" : userData.name.split(" ")[0] + ": "} {data.lastMessage}</p>
            </div>
        </div >
    )

}


const SellerInbox = ({ setOpen, newMessage, setNewMessage, sendMessageHandler, messages, sellerId, userData, activeStatus }) => {
    console.log("Seller Inbox user" + userData)
    return (
        <div className='w-full min-h-full flex flex-col justify-between'>
            {/* Message Header */}
            <div className="w-full flex p-3 items-center justify-between bg-slate-200">
                <div className="flex">
                    <img src={`${backend_url}upload/${userData.avatar}`} alt="" className="w-[60px] h-[60px] rounded-full" />
                    <div className="pl-3">
                        <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
                        <h1>{activeStatus ? "Active Now" : "Offline"}</h1>
                    </div>
                </div>
                <AiOutlineArrowRight size={20} onClick={() => setOpen(false)} className='cursor-pointer' />

            </div>

            {/* Messages */}
            <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
                {
                    messages && messages.map((item, index) => (

                        <div className={`flex w-full my-2 ${item.sender === sellerId ? "justify-end" : "justify-start"}`}>
                            {
                                item.sender !== sellerId && (
                                    <img src={`${backend_url}upload/${userData.avatar}`} alt="" className='w-[40px] h-[40px] rounded-full mr-3' />


                                )
                            }

                            <div className="w-max bg-[#38c776] text-white h-min p-2 rounded">
                                <p>{item.text}</p>
                                <span className='text-[10px] text-gray-300 block text-right'>{format(item.createdAt)}</span>
                            </div>
                        </div>

                    ))
                }
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