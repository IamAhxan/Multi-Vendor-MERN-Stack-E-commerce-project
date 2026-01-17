import React from 'react';
import styles from '../../../styles/styles';
import { Link } from 'react-router-dom';
import { navItems } from '../../../static/data';

const Navbar = ({ active }) => {
    return (
        <div className={`${styles.normalFlex}`}>
            {
                navItems && navItems.map((i, index) => (
                    <div className="flex" key={index}>
                        <Link
                            to={i.url}
                            className={`${active === index + 1 ? "text-[#17dd1f]" : "text-white"
                                } font-medium px-6 cursor-pointer`}
                        >
                            {i.title}
                        </Link>
                    </div>
                ))
            }
        </div>
    );
};

export default Navbar;