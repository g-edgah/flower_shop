import { useEffect, useState } from "react";
import { useOrders } from "../../hooks/user";
import OrderCard from "./orderCard";

const Orders = ({ refetch, user }) => {
    const [ ordersType, setOrdersType ] = useState("ongoing")

    const { data, isLoading, error, userdata } = useOrders();

    if (data) {
        console.log("orders data: ", data)
    }
   
    
    const ongoingOrders = data?.orders.filter(order => order.status === "pending" || order.status === "delivered" || order.status === "shipped" || order.status === "processing");
    console.log("ongoing orders: ", ongoingOrders)

    const cancelledOrders = data?.orders.filter(order => order.status === "cancelled" || order.status === "returned");
    console.log("cancelled orders: ", cancelledOrders)

    const handleOrdersType = (type) => {
        if (type) {
            setOrdersType(type)
        }
    }

    return (
        <div className="orders p-3">
            <span className="title text-xl font-bold">Orders</span>
            <div className="top text-lg flex gap-5 px-2 py-5">
                <span onClick={() => handleOrdersType("ongoing")} className="cursor-pointer" className={`font-semibold cursor-pointer ${ordersType === "ongoing" ? "text-summaryButtons" : ""}`}>Ongoing/Delivered</span>
                <span onClick={() => handleOrdersType("cancelled")} className="cursor-pointer" className={`font-semibold cursor-pointer ${ordersType === "cancelled" ? "text-summaryButtons" : ""}`}>Cancelled/Returned</span>
            </div>
            

            <div className="cont flex flex-col gap-3">
            {isLoading && <span>fetching orders</span>}
            {error && <span>error fetching orders: {error.message}</span>}
            {data && data.orders && ordersType === "ongoing" && (
                (ongoingOrders.length === 0) ? (
                    <div className="w-full h-40 flex flex-col items-center justify-center gap-3">
                        <span className="text-lg">No ongoing or delivered orders found.</span>
                    </div>
                ) : (   
                ongoingOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))
                )
            )}

            {data && data.orders && ordersType === "cancelled" && (
                (cancelledOrders.length === 0) ? (
                    <div className="w-full h-40 flex flex-col items-center justify-center gap-3">
                        <span className="text-lg">No cancelled or returned orders found.</span>
                    </div>
                ) : (
                cancelledOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))
                )
            )}
            </div>
        </div>
    )
}

export default Orders