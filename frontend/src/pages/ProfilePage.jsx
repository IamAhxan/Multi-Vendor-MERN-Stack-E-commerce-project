import React, { useState } from 'react'
import Header from '../components/Layout/Header/Header'
import Footer from '../components/Layout/Footer'
import styles from '../styles/styles'
import ProfileSidebar from "../components/profile/ProfileSidebar.jsx"
import ProfileContent from "../components/profile/ProfileContent.jsx"

const ProfilePage = () => {
    const [active, setActive] = useState(1)
    return (
        <div>
            <Header />
            <div className={`${styles.section} flex bg-[#f5f5f5] py-10`}>
                <div className="w-[50px] 800px:w-[335px] sticky 800px:mt-0 mt-[18%]">
                    <ProfileSidebar active={active} setActive={setActive} />
                </div>
                <ProfileContent active={active} setActive={setActive} />
            </div>
            <Footer />
        </div>
    )
}
export default ProfilePage