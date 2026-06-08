import { useEffect, useState } from "react";
import { useOrders } from "../../hooks/user";
import ReviewCard from "./reviewCard";

import { FaArrowLeft } from "react-icons/fa6";

const Reviews = ({ refetch, user }) => {
    const [ reviewsType, setReviewsType ] = useState("notReviewed")
    const [reviewState, setReviewState] = useState("reviews")
    const [ reviewDetails, setReviewDetails ] = useState(null)

    const { data, isLoading, error, userdata } = useOrders();

    if (data) {
        console.log("orders data: ", data)
    }
   
    //console.log("order user: ", user)
    
    const deliveredOrders = data?.orders.filter(order => order.status === "Delivered");
    //console.log("ongoing orders: ", ongoingOrders)

    const unreviewedOrders = data?.orders.filter(order => order.status === "Delivered");

    const handleReviewsType = (type) => {
        if (type) {
            setReviewsType(type)
        }
    }

    const handleReviewDetails = (order, state) => {
        setReviewDetails(order)
        setReviewState(state)
    }

    console.log("review type: ", reviewsType)

    //console.log("orderState: ", orderState)
    return (
       
        <div className="orders">
            {reviewState === "reviews" && (
            <div className='p-3'>
                <div className="title border-b border-gray-300 w-10/10 p-3">
                    <span className="title text-xl font-bold ">Orders</span>
                </div>
                
                <div className="top text-lg flex gap-5 px-2 py-5">
                    
                    <span onClick={() => handleReviewsType("notReviewed")} className={`font-semibold cursor-pointer ${reviewsType === "notReviewed" ? "text-summaryButtons" : ""}`}>Not Reviewed</span>
                    
                    <span onClick={() => handleReviewsType("reviewed")}  className={`font-semibold cursor-pointer ${reviewsType === "reviewed" ? "text-summaryButtons" : ""}`}>Reviewed</span>
                </div>
                

                <div className="cont flex flex-col gap-3">
                {isLoading && <span>fetching orders</span>}
                {error && <span>error fetching orders: {error.message}</span>}
                {data && data.orders && reviewsType === "notReviewed" && (
                    (deliveredOrders.length === 0) ? (
                        <div className="w-full h-40 flex flex-col items-center justify-center gap-3">
                            <span className="text-lg">No pending reviews found.</span>
                        </div>
                    ) : (   
                    deliveredOrders.map((order) => (
                        order.items.filter((item) => item.reviewStatus === 'notReviewed' ).map(item => 
                            <ReviewCard key={item._id} order={order} item={item} status={order.status} deliveryDate={order.deliveryDate} orderDate={order.orderDate} trackingNo={order.trackingNumber} handleReviewDetails={handleReviewDetails} />
                        
                        ))
                    )
                    )
                )}

                {data && data.orders && reviewsType === "reviewed" && (
                    (deliveredOrders.length === 0) ? (
                        <div className="w-full h-40 flex flex-col items-center justify-center gap-3">
                            <span className="text-lg">No cancelled or returned orders found.</span>
                        </div>
                    ) : (   
                    deliveredOrders.map((order) => (
                        order.items.filter((item) => item.reviewStatus === 'reviewed' ).map(item => 
                            <ReviewCard key={item._id} order={order} item={item} status={order.status} deliveryDate={order.deliveryDate} orderDate={order.orderDate} trackingNo={order.trackingNumber} handleReviewDetails={handleReviewDetails} />
                        
                        ))
                    )
                    )
                )}
                </div>
            </div>
            )}
            {reviewState === "details" && (
            <div className="details flex flex-col p-3 gap-5">
                <div className="title flex gap-5 items-center border-b border-gray-300 w-full p-3">
                    <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" onClick={() => setReviewState("reviews")} />
                    <span className="title text-xl font-bold">Order Details</span>
                </div>


                <div className="details flex flex-col gap-2 border-[1.5px] border-gray-400 rounded-md p-3 bg-gray-200">
                    <span className="number font-bold mb-2 pt-2">Order NO {reviewDetails?.trackingNumber}</span>
                    <span className="status">Status: {reviewDetails?.status}</span>
                    <span className="orderDate">Order Date: {new Date(reviewDetails?.orderDate).toLocaleDateString()}</span>
                    <span className="deliveryDate">Delivery Date: {new Date(reviewDetails?.deliveryDate).toLocaleDateString()}</span>
                    <span className="itemsTitle font-semibold text-md mt-3">Items: {reviewDetails?.items?.length || 0}</span>
                </div>

                <div className="items flex flex-col gap-3">
                    {reviewDetails?.items?.map((item) => (
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
                            
                            <span className="method">Method: {reviewDetails?.paymentMethod}</span>
                            <span className="subtotal">Sub Total: Ksh {reviewDetails?.subTotal}</span>
                            <span className="shipping">Shipping Cost: Ksh {reviewDetails?.shippingCost}</span>
                            <span className="total font-bold pt-3 text-lg">Total: Ksh {reviewDetails?.total}</span>
                        </div>
                    </div>

                    <div className="deliveryinf0 flex flex-col gap-2 border-[1.5px] border-gray-400 rounded-md  w-5/10 bg-gray-200">
                        <span className="title font-semibold text-lg border-b border-gray-400 pb-2 p-3">Delivery Information</span>
                        <div className="flex flex-col gap-2 p-3">
                            <span className="name">Name: {user?.firstName} {user?.lastName}</span>
                            <span className="name">Region: {reviewDetails?.shippingAddress?.region}</span>
                            <span className="phone">City: {reviewDetails?.shippingAddress?.city}</span>
                            <span className="address">Address: {reviewDetails?.shippingAddress?.address}</span>
                            <span className="address">Info: {reviewDetails?.shippingAddress?.info}</span>
                            <span className="address">Mobile: {reviewDetails?.shippingAddress?.mobile}</span>
                        </div>
                    </div>
                </div>


                
            </div>
            )}
        </div>
        
    
)}

export default Reviews