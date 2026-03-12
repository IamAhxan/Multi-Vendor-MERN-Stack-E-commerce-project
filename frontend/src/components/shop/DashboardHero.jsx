import React, { useEffect, useState } from 'react'
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai'
import { MdBorderClear } from 'react-icons/md'
import styles from '../../styles/styles'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersOfShop } from '../../redux/actions/order'
import { getAllProductsShop } from '../../redux/actions/product'
import Loader from '../Layout/Loader'
import { DataGrid } from "@mui/x-data-grid";
import { Button } from '@mui/material'


const DashboardHero = () => {
    const dispatch = useDispatch();

    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);
    const [deliveredOrders, setDeliveredOrders] = useState(null)


    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));
        dispatch(getAllProductsShop(seller._id));


        const orderData = orders && orders.filter((item) => item.Status === "Delivered");
        setDeliveredOrders(orderData);

    }, [dispatch])


    const totalEarningWithoutTax = deliveredOrders && deliveredOrders.reduce((acc, item) => acc + item.totalPrice, 0);

    const serviceCharge = totalEarningWithoutTax * 0.1; // 10% service charge
    const availableBalance = (totalEarningWithoutTax - serviceCharge).toFixed(2);



    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.value === "Delivered" ? "greenColor" : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },

        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },

        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <>
                        <Link to={`/order/${params.id}`}>
                            <Button>
                                <AiOutlineArrowRight size={20} />
                            </Button>
                        </Link>
                    </>
                );
            },
        },
    ];

    const row = [];

    orders &&
        orders.forEach((item) => {
            row.push({
                id: item._id,
                itemsQty: item.cart.length, // Fixed: changed .cart to .orderItems
                total: "US$ " + item.totalPrice,
                status: item.Status, // Fixed: changed .status to .orderStatus
            });
        });


    return (
        <div className='w-full px-4 md:px-8 py-8 box-border overflow-hidden'>
            <h3 className='text-[22px] font-poppins pb-2'>Overview</h3>
            <div className="w-full block 800px:flex items-center justify-between">
                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">
                        <AiOutlineMoneyCollect size={30} className='mr-2' fill="#00000085" />
                        <h3 className={`${styles.productTitle} text-[18px]! leading-5 font-[400]! text-[#00000085]`}>
                            Account Balance <span className='text-[16px]'>with 10% service Charge</span>
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                        ${availableBalance}
                    </h5>
                    <Link to="/dashboard-withdray-money">
                        <h5 className="pt-4 pl-2 text-[#077f9c]">Withdraw Money</h5>
                    </Link>
                </div>

                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">
                        <MdBorderClear size={30} className='mr-2' fill="#00000085" />
                        <h3 className={`${styles.productTitle} text-[18px]! leading-5 font-[400]! text-[#00000085]`}>
                            All Orders
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                        {orders && orders.length}
                    </h5>
                    <Link to="/dashboard-orders">
                        <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
                    </Link>
                </div>

                <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
                    <div className="flex items-center">
                        <AiOutlineMoneyCollect size={30} className='mr-2' fill="#00000085" />
                        <h3 className={`${styles.productTitle} text-[18px]! leading-5 font-[400]! text-[#00000085]`}>
                            All Products
                        </h3>
                    </div>
                    <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
                        {products && products.length}
                    </h5>
                    <Link to="/dashboard-products">
                        <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
                    </Link>
                </div>







            </div>

            <br />

            <h3 className="text-[22px] font-poppins pb-2"> Latest Orders</h3>
            <div className="w-full min-h-[45vh] bg-white rounded">

                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="w-full mx-1 pt-1 mt-10 bg-white">
                        <DataGrid
                            rows={row}
                            columns={columns}
                            pageSize={10}
                            disableRowSelectionOnClick
                            autoHeight
                        />

                    </div>
                )}

            </div>

        </div >
    )
}

export default DashboardHero