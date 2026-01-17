import React from "react";
import styles from "../../styles/styles";

const Sponsored = () => {
    return (
        <div
            className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}
        >
            <div className=" flex justify-between w-full">
                <div className="flex items-start">
                    <img src="https://logos-world.net/wp-content/uploads/2021/08/Beats-Logo-120x67.png" alt="" style={{ width: "150px", objectFit: "contain" }} />
                </div>
                <div className="flex items-start">
                    <img src="https://logos-world.net/wp-content/uploads/2020/11/BlackBerry-Logo-120x67.png" alt="" style={{ width: "150px", objectFit: "contain" }} />
                </div>
                <div className="flex items-start">
                    <img src="https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo-120x67.png" alt="" style={{ width: "150px", objectFit: "contain" }} />
                </div>
                <div className="flex items-start">
                    <img src="https://logos-world.net/wp-content/uploads/2020/05/Amazon-Kindle-Logo-120x67.png" alt="" style={{ width: "150px", objectFit: "contain" }} />
                </div>
                <div className="flex items-start">
                    <img src="https://logos-world.net/wp-content/uploads/2020/03/AMD-Logo-120x67.png" alt="" style={{ width: "150px", objectFit: "contain" }} />
                </div>
            </div>
        </div>
    );
};

export default Sponsored;
