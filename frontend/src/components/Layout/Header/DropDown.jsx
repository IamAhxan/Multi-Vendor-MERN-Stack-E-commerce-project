import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../../styles/styles'

const DropDown = ({ categoriesData, setDropDown }) => {
    const navigate = useNavigate()

    const handleSubmit = (i) => {
        navigate(`/products?category=${i.title}`);
        setDropDown(false);
        window.location.reload();
    }

    return (
        /* Changed w-67.5 to w-[270px] for reliability across browsers */
        <div className='pb-4 w-[270px] bg-white absolute z-30 rounded-b-md shadow-sm'>
            {
                categoriesData && categoriesData.map((i, index) => (
                    <div
                        key={index}
                        className={`${styles.normalFlex} cursor-pointer hover:bg-[#f5f5f5]`}
                        onClick={() => handleSubmit(i)}
                    >
                        <img
                            src={i.image_Url}
                            style={{
                                width: "25px",
                                height: "25px",
                                objectFit: "contain",
                                marginLeft: "10px",
                                userSelect: "none"
                            }}
                            alt={i.title}
                        />
                        <h3 className='m-3 cursor-pointer select-none text-[14px] font-Poppins'>
                            {i.title}
                        </h3>
                    </div>
                ))
            }
        </div>
    )
}

export default DropDown;