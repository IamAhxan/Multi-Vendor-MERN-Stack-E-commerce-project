import React from 'react'
import styles from '../../../styles/styles'
import { Link } from 'react-router-dom'

const Hero = () => {
    return (
        <div className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`}
            style={{ backgroundImage: "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)", }}
        >
            <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
                <h1 className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-semibold capitalize`}>
                    Best Collection for <br /> Home Decoration
                </h1>
                <p className='pt-5 text-[16px] font-poppins font-normal text-[#000000ba]'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt eligendi possimus ipsum nostrum praesentium laudantium eos sint, ut error sed adipisci ab eveniet at nulla doloribus dolorum hic, quas voluptatem molestiae commodi excepturi impedit minus! Culpa provident incidunt tempora laboriosam quos a deleniti amet aperiam rerum consequuntur? Deleniti, recusandae quisquam.
                </p>
                <Link to="/products" className='inline-block'>
                    <div className={`${styles.button} mt-5`}>
                        <span className="text-white font-poppins text-[18px]">Shop Now</span></div></Link>
            </div>
        </div>
    )
}

export default Hero