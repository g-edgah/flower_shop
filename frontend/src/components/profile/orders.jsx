import { useEffect, useState } from "react";
import { useOrders } from "../../hooks/user";
import OrderCard from "./orderCard";

import { FaArrowLeft } from "react-icons/fa6";

const Orders = ({ refetch, user }) => {
    const [ ordersType, setOrdersType ] = useState("ongoing")
    const [orderState, setOrderState] = useState("orders")
    const [ orderDetails, setOrderDetails ] = useState(null)

    const { data, isLoading, error, userdata } = useOrders();

    // if (data) {
    //     console.log("orders data: ", data)
    // }
   
    //console.log("order user: ", user)
    
    const ongoingOrders = data?.orders.filter(order => order.status === "Pending" || order.status === "Delivered" || order.status === "Shipped" || order.status === "Processing");
    //console.log("ongoing orders: ", ongoingOrders)

    const cancelledOrders = data?.orders.filter(order => order.status === "Cancelled" || order.status === "Returned");
    //console.log("cancelled orders: ", cancelledOrders)

    const handleOrdersType = (type) => {
        if (type) {
            setOrdersType(type)
        }
    }

    const handleOrderDetails = (order, state) => {
        setOrderDetails(order)
        setOrderState(state)
    }

    //console.log("orderState: ", orderState)
    return (
       
        <div className="orders">
            {orderState === "orders" && (
            <div className='p-3'>
                <div className="title border-b border-gray-300 w-10/10 p-3">
                    <span className="title text-xl font-bold ">Orders</span>
                </div>
                
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
                        order.items.map(item => 
                        <OrderCard key={item._id} order={order} item={item} status={order.status} deliveryDate={order.deliveryDate} orderDate={order.orderDate} trackingNo={order.trackingNumber} handleOrderDetails={handleOrderDetails} />
                        )
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
                        <OrderCard key={item._id} order={order} item={item} status={order.status} deliveryDate={order.deliveryDate} orderDate={order.orderDate} trackingNo={order.trackingNumber} handleOrderDetails={handleOrderDetails} />
                    ))
                    )
                )}
                </div>
            </div>
            )}
            {orderState === "details" && (
            <div className="details flex flex-col p-3 gap-5">
                <div className="title flex gap-5 items-center border-b border-gray-300 w-full p-3">
                    <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" onClick={() => setOrderState("orders")} />
                    <span className="title text-xl font-bold">Order Details</span>
                </div>


                <div className="details flex flex-col gap-2 border-[1.5px] border-gray-400 rounded-md p-3 bg-gray-200">
                    <span className="number font-bold mb-2 pt-2">Order NO {orderDetails?.trackingNumber}</span>
                    <span className="status">Status: {orderDetails?.status}</span>
                    <span className="orderDate">Order Date: {new Date(orderDetails?.orderDate).toLocaleDateString()}</span>
                    <span className="deliveryDate">Delivery Date: {new Date(orderDetails?.deliveryDate).toLocaleDateString()}</span>
                    <span className="itemsTitle font-semibold text-md mt-3">Items: {orderDetails?.items?.length || 0}</span>
                </div>

                <div className="items flex flex-col gap-3">
                    {orderDetails?.items?.map((item) => (
                        <div key={item._id} className="item flex gap-5 items-center border-[1.5px] border-gray-400 rounded-md p-3 bg-gray-200">
                            <div className="img size-32">
                                <img
                                    src={`/${item.product.picturePath}`}
                                    alt={`${item.product.name}`}
                                    className="rounded-md w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/default-product.png';
                                    }}
                                />
                            </div>
                            <div className="info flex flex-col gap-5 text-[15px] text-gray-800 ">
                                <span className="name font-semibold text-lg text-black">{item.product.name}</span>
                                <span className="quantity">Quantity: {item.quantity}</span>
                                <span className="price">Price: Ksh {item.product.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="detail flex justify-between">
                    <div className="payinfo flex flex-col gap-2 border-[1.5px] border-gray-400 rounded-md mr-5 w-5/10 bg-gray-200">
                        <span className="title font-semibold text-lg border-b border-gray-400 pb-2 p-3">Payment Information</span>
                        <div className="flex flex-col gap-3 p-3">
                            
                            <span className="method">Method: {orderDetails?.paymentMethod}</span>
                            <span className="subtotal">Sub Total: Ksh {orderDetails?.subTotal}</span>
                            <span className="shipping">Shipping Cost: Ksh {orderDetails?.shippingCost}</span>
                            <span className="total font-bold pt-3 text-lg">Total: Ksh {orderDetails?.total}</span>
                        </div>
                    </div>

                    <div className="deliveryinf0 flex flex-col gap-2 border-[1.5px] border-gray-400 rounded-md  w-5/10 bg-gray-200">
                        <span className="title font-semibold text-lg border-b border-gray-400 pb-2 p-3">Delivery Information</span>
                        <div className="flex flex-col gap-2 p-3">
                            <span className="name">Name: {user?.firstName} {user?.lastName}</span>
                            <span className="name">Region: {orderDetails?.shippingAddress?.region}</span>
                            <span className="phone">City: {orderDetails?.shippingAddress?.city}</span>
                            <span className="address">Address: {orderDetails?.shippingAddress?.address}</span>
                            <span className="address">Info: {orderDetails?.shippingAddress?.info}</span>
                            <span className="address">Mobile: {orderDetails?.shippingAddress?.mobile}</span>
                        </div>
                    </div>
                </div>


                
            </div>
            )}
        </div>
        
    
)}

export default Orders