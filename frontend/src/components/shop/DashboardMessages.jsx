import React from 'react'

const DashboardMessages = () => {
    return (
        <div className='w-[90%] bg-white m-3 h-[85vh] overflow-y-scroll rounded'>
            <h1 className='text-center text-[30px] font-poppins py-3'>All Messages</h1>
            {/* All Messages List */}

            <MessageList />


        </div>
    )
}


const MessageList = () => {
    return (
        <div className="w-full flex p-3 px-3 bg-[#00000010] cursor-pointer">
            <div className="relative">
                <img src="http://localhost:3000/upload/1772282961145.jpg" alt="" className="w-[50px] h-[50px] rounded-full" />
                <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]"></div>
            </div>
            <div className="pl-3">
                <h1 className=' text-[18px] '>Ahsan</h1>
                <p className='  text-[16px] text-[#000c]'>You: Lorem ipsum, dolor sit ...</p>
            </div>
        </div>
    )
}

export default DashboardMessages