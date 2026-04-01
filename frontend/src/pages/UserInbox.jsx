import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { backend_url, server } from '../server'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { AiOutlineArrowRight, AiOutlineSend } from 'react-icons/ai'
import { TfiGallery } from 'react-icons/tfi'
import styles from '../styles/styles'
import socketIO from 'socket.io-client'
import { format } from 'timeago.js'
import Loader from '../components/Layout/Loader'
import Header from '../components/Layout/Header/Header'

const ENDPOINT = "https://multi-vendor-socket.onrender.com"
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] })

const UserInbox = () => {
    const { user } = useSelector((state) => state.user);
    const [conversations, setConversations] = useState([])
    const [open, setOpen] = useState(false)
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const [messages, setMessages] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [newMessage, setNewMessage] = useState("")
    const [userInboxSeller, setUserInboxSeller] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])
    const [activeStatus, setActiveStatus] = useState(false)

    const userId = user._id;

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
        axios.get(`${server}/conversation/get-all-conversation-user/${userId}`, {
            withCredentials: true,
        }).then((res) => {
            setConversations(res.data.conversations)
        }).catch((error) => {
            toast.error(error.response?.data?.message);
        })
    }, [user])

    useEffect(() => {
        if (user) {
            socketId.emit("addUser", userId);
            socketId.on("getUsers", (users) => {
                setOnlineUsers(users)
            })
        }
    }, [user])

    const onlineCheck = (chat) => {
        const chatMembers = chat.members.find((member) => member !== user?._id)
        const online = onlineUsers.find((u) => u.userId === chatMembers)
        return online ? true : false
    }

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await axios.get(`${server}/message/get-all-messages/${currentChat._id}`, {
                    withCredentials: true,
                })
                setMessages(response.data.messages)
            } catch (error) {
                toast.error(error.response?.data?.message);
                console.log(error)
            }
        }
        if (currentChat) { getMessages() }
    }, [currentChat])

    const sendMessageHandler = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };
        const receiverId = currentChat.members.find((member) => member !== user._id);
        socketId.emit("sendMessage", {
            senderId: user._id,
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
                    toast.error(error.response?.data?.message);
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
            lastMessageId: user._id,
        })

        await axios.put(`${server}/conversation/update-last-message/${currentChat._id}`, {
            lastMessage: newMessage,
            lastMessageId: user._id,
        }).then((res) => {
            console.log(res.data.conversation)
            setNewMessage("")
        }).catch((error) => {
            toast.error(error.response?.data?.message);
            console.log(error)
        })
    }

    return (
        <div className='w-full'>
            <Header />
            <div className='w-[90%] bg-white m-auto mt-5 h-[85vh] overflow-y-scroll rounded'>
                {!open && (
                    <>
                        <h1 className='text-center text-[30px] font-poppins py-3'>All Messages</h1>
                        {conversations && conversations.map((item, index) => (
                            <MessageList
                                key={index}
                                data={item}
                                index={index}
                                setOpen={setOpen}
                                setCurrentChat={setCurrentChat}
                                me={user._id}
                                setUserInboxSeller={setUserInboxSeller}
                                online={onlineCheck(item)}
                                setActiveStatus={setActiveStatus}
                            />
                        ))}
                    </>
                )}

                {open && (
                    <UserInboxChat
                        userData={userInboxSeller}
                        setOpen={setOpen}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        sendMessageHandler={sendMessageHandler}
                        messages={messages}
                        userId={userId}
                        activeStatus={activeStatus}
                    />
                )}
            </div>
        </div>
    )
}


const MessageList = ({ data, index, setOpen, setCurrentChat, me, setUserInboxSeller, online, setActiveStatus }) => {
    const navigate = useNavigate()
    const [active, setActive] = useState(0)
    const [userData, setUserData] = useState(null)



    useEffect(() => {
        setActiveStatus(online)
        const sellerId = data.members.find((member) => member !== me)

        const getSeller = async () => {
            try {
                const res = await axios.get(`${server}/shop/get-shop-info/${sellerId}`);
                setUserData(res.data.shop)
            } catch (error) {
                console.log(error)
                toast.error(error.response?.data?.message);
            }
        }
        getSeller()
    }, [me, data])





    const handleClick = (id) => {
        navigate(`?${id}`)
        setUserInboxSeller(userData) // ✅ userData is populated here
        setOpen(true)               // ✅ open after setting seller
    }

    if (!userData) return <Loader />

    return (
        <div
            className={`w-full flex p-3 px-3 ${active === index ? 'bg-[#00000010]' : "bg-transparent"} cursor-pointer`}
            onClick={() => {
                setActive(index)
                handleClick(data._id)
                setCurrentChat(data)
            }}
        >
            <div className="relative">
                <img
                    src={`${userData?.avatar}`}
                    alt={userData?.name}
                    className="w-[50px] h-[50px] rounded-full"
                />
                {online ? (
                    <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]"></div>
                ) : (
                    <div className="w-[12px] h-[12px] bg-red-500 rounded-full absolute top-[2px] right-[2px]"></div>
                )}
            </div>
            <div className="pl-3">
                <h1 className='text-[18px]'>{userData.name}</h1>
                <p className='text-[16px] text-[#000c]'>
                    {data.lastMessageId !== me ? userData.name.split(" ")[0] + ": " : "You: "}
                    {data.lastMessage}
                </p>
            </div>
        </div>
    )
}


const UserInboxChat = ({ setOpen, newMessage, setNewMessage, sendMessageHandler, messages, userId, userData, activeStatus }) => {
    if (!userData) return <Loader />

    return (
        <div className='w-full min-h-full flex flex-col justify-between'>
            {/* Message Header */}
            <div className="w-full flex p-3 items-center justify-between bg-slate-200">
                <div className="flex items-center">
                    <img
                        src={`${userData.avatar}`}
                        alt={userData.name}
                        className="w-[60px] h-[60px] rounded-full"
                    />
                    <div className="pl-3">
                        <h1 className="text-[18px] font-[600]">{userData.name}</h1>
                        <h1>{activeStatus ? "Active Now" : "Offline"}</h1>
                    </div>
                </div>
                <AiOutlineArrowRight size={20} onClick={() => setOpen(false)} className='cursor-pointer' />
            </div>

            {/* Messages */}
            <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
                {messages && messages.map((item, index) => (
                    <div key={index} className={`flex w-full my-2 ${item.sender === userId ? "justify-end" : "justify-start"}`}>
                        {item.sender !== userId && (
                            <img
                                src={`${userData.avatar}`}
                                alt={userData.name}
                                className='w-[40px] h-[40px] rounded-full mr-3'
                            />
                        )}
                        <div className={`w-max max-w-[70%] h-min p-2 rounded ${item.sender === userId ? "bg-[#38c776] text-white" : "bg-[#f0f0f0] text-black"}`}>
                            <p>{item.text}</p>
                            <span className='text-[10px] text-gray-300 block text-right'>{format(item.createdAt)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Send Message Input */}
            <form
                aria-required={true}
                className='p-3 relative flex justify-between items-center'
                onSubmit={sendMessageHandler}
            >
                <div className="w-[3%]">
                    <TfiGallery size={20} className='cursor-pointer' />
                </div>
                <div className="w-[95%]">
                    <input
                        type="text"
                        required
                        placeholder='Type a message...'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className={`${styles.input}`}
                    />
                    <input type="submit" value="Send" className='hidden' id='send' />
                    <label htmlFor="send">
                        <AiOutlineSend size={20} className='absolute right-8 top-5 cursor-pointer' />
                    </label>
                </div>
            </form>
        </div>
    )
}

export default UserInbox