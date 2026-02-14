import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { server } from '../../server';
import styles from '../../styles/styles';
import axios from 'axios';
import { getAllProductsShop } from '../../redux/actions/product';
import { Link, useParams } from 'react-router-dom';
import Loader from '../Layout/Loader';

const ShopInfo = ({ isOwner }) => {
    const { products } = useSelector((state) => state.products);
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductsShop(id));
        setIsLoading(true);
        axios.get(`${server}/shop/get-shop-info/${id}`)
            .then((res) => {
                setData(res.data.shop);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, [dispatch, id]); // Added dependencies

    const logoutHandler = async () => {
        await axios.get(`${server}/shop/logout`, { withCredentials: true });
        window.location.reload();
    };

    // useMemo prevents recalculating on every re-render unless products change
    const avgRating = useMemo(() => {
        if (!products || products.length === 0) return 0;
        const totalRatings = products.reduce((acc, item) => acc + (item.ratings || 0), 0);
        return (totalRatings / products.length).toFixed(1);
    }, [products]);

    if (isLoading) return <Loader />;

    return (
        <div className="w-full bg-white rounded-[5px] shadow-sm pb-4">
            <div className="w-full py-5">
                <div className="w-full flex items-center justify-center">
                    <img
                        src={data?.avatar?.url}
                        alt="Shop Avatar"
                        className="w-[150px] h-[150px] object-cover rounded-full border-[3px] border-[#3ad132]"
                    />
                </div>
                <h3 className="text-center py-2 text-[20px] font-Poppins font-[600]">{data?.name}</h3>
                <p className="text-[15px] text-[#000000a6] p-[10px] flex items-center">
                    {data?.description}
                </p>
            </div>

            <div className="p-3">
                <h5 className="font-[600]">Address</h5>
                <h4 className="text-[#000000a6]">{data?.address}</h4>
            </div>

            <div className="p-3">
                <h5 className="font-[600]">Total Products</h5>
                <h4 className="text-[#000000a6]">{products?.length || 0}</h4>
            </div>

            <div className="p-3">
                <h5 className="font-[600]">Shop Ratings</h5>
                <h4 className="text-[#000000b0]">{avgRating}/5</h4>
            </div>

            <div className="p-3">
                <h5 className="font-[600]">Joined On</h5>
                <h4 className="text-[#000000b0]">{data?.createdAt?.slice(0, 10)}</h4>
            </div>

            {isOwner && (
                <div className="py-3 px-4 flex flex-col gap-3">
                    <Link to="/settings">
                        <div className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}>
                            <span className="text-white">Edit Shop</span>
                        </div>
                    </Link>
                    <div
                        className={`${styles.button} !w-full !h-[42px] !rounded-[5px] !bg-red-600`}
                        onClick={logoutHandler}
                    >
                        <span className="text-white">Log Out</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopInfo;