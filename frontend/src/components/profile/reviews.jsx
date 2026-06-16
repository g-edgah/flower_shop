import { useEffect, useState } from "react";
import { useOrders } from "../../hooks/user";
import ReviewCard from "./reviewCard";

import { FaArrowLeft } from "react-icons/fa6";
import { HiStar, HiOutlineStar } from "react-icons/hi2";

const Reviews = ({ refetch, user }) => {
    const [ reviewsType, setReviewsType ] = useState("notReviewed")
    const [reviewState, setReviewState] = useState("reviews")
    const [ reviewOrderDetails, setReviewOrderDetails ] = useState(null)
    const [ reviewItemDetails, setReviewItemDetails ] = useState(null)

    const [productRating, setProductRating] = useState(reviewItemDetails?.productRating);
    const [serviceRating, setServiceRating] = useState(reviewItemDetails?.serviceRating);
    const [comment, setComment] = useState(reviewItemDetails?.review);
    const [hover, setHover] = useState(0);
    

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

    const handleReviewDetails = (order, item, state) => {
        setReviewOrderDetails(order)
        setReviewItemDetails(item)
        setReviewState(state)
    }

    const handleClick = (selectedRating) => {
        if (disabled || readOnly) return;
        setRating(selectedRating);
        if (onRatingChange) {
            onRatingChange(selectedRating);
        }
    };

    const handleMouseEnter = (starValue) => {
        if (disabled || readOnly) return;
        setHover(starValue);
    };

    const handleMouseLeave = () => {
        if (disabled || readOnly) return;
        setHover(0);
    };



    console.log("review type: ", reviewsType)

    //console.log("orderState: ", orderState)
    return (
       
        <div className="orders">
            {reviewState === "reviews" && (
            <div className='p-3'>
                <div className="title border-b border-gray-300 w-10/10 p-3">
                    <span className="title text-xl font-bold ">Reviews</span>
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
                    <span className="title text-xl font-bold">Review/Rate</span>
                </div>


                <div className="details flex flex-col gap-2 border-[1.5px] border-gray-400 rounded-md p-3 bg-gray-200">
                    <span className="number font-bold mb-2 pt-2">Order NO {reviewOrderDetails?.trackingNumber}</span>
                    <span className="status">Status: {reviewOrderDetails?.status}</span>
                    <span className="orderDate">Order Date: {new Date(reviewOrderDetails?.orderDate).toLocaleDateString()}</span>
                    <span className="deliveryDate">Delivery Date: {new Date(reviewOrderDetails?.deliveryDate).toLocaleDateString()}</span>
                    <span className="itemsTitle font-semibold text-md mt-3">Items: {reviewOrderDetails?.items?.length || 0}</span>
                </div>

                <div className="items flex flex-col gap-3">
                        <div  className="item flex gap-5 items-center border-[1.5px] border-gray-400 rounded-md p-3 bg-gray-200">
                            <div className="img size-32">
                                <img
                                    src={`/${reviewItemDetails.product.picturePath}`}
                                    alt={`${reviewItemDetails.name}`}
                                    className="rounded-md w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/default-product.png';
                                    }}
                                />
                            </div>
                            <div className="info flex flex-col gap-5 text-[15px] text-gray-800 ">
                                <span className="name font-semibold text-lg text-black">{reviewItemDetails.name}</span>
                                <span className="quantity">rate this product</span>
                                <div className="stars flex">
                                    {[1, 2, 3, 4, 5 ].map((star) => (
                                        <button 
                                            onClick={() => handleClick(star)}
                                            onMouseEnter={() => handleMouseEnter(star)}
                                            onMouseLeave={handleMouseLeave}
                                            
                                            className="5 flex">
                                                <HiStar className="size-7 hover:text-summaryButtons"/>
                                        </button> 
                                    ))} 
        
                                </div>
                                <span className="price">Rate the service delivery</span>
                            </div>
                        </div>
                    
                </div>
                <button className="detail flex bg-summaryButtons rounded-md p-2 text-white items-center justify-center">
                    <span>submit</span>
                    
                </button>


                
            </div>
            )}
        </div>
        
    
)}

export default Reviews