import { useEffect, useState } from "react";
import { useOrders, useReview } from "../../hooks/user";
import ReviewCard from "./reviewCard";
import ExpandedReviewCard from './reviewCardExpanded.jsx'

import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';


const Reviews = ({ refetch, user }) => {
    const navigate = useNavigate()

    const [ reviewsType, setReviewsType ] = useState("notReviewed")
    const [reviewState, setReviewState] = useState("reviews")
    const [ reviewOrderDetails, setReviewOrderDetails ] = useState(null)
    const [ reviewItemDetails, setReviewItemDetails ] = useState(null)

    const [productRating, setProductRating] = useState(reviewItemDetails?.productRating);
    const [serviceRating, setServiceRating] = useState(reviewItemDetails?.serviceRating);
    const [comment, setComment] = useState(reviewItemDetails?.review);
    const [productStar, setProductStar] = useState(0);
    const [serviceStar, setServiceStar] = useState(0);
    const [productHover, setProductHover] = useState(0);
    const [serviceHover, setServiceHover] = useState(0);
    const [errors, setErrors] = useState({})
    

    const { data, isLoading, error, orderdata, refetch: ordersRefetch } = useOrders();

    const { mutate: editReview, isLoading: reviewLoading, error: reviewError } = useReview();

    // if (data) {
    //     console.log("orders data: ", data)
    // }
   
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

    const handleRating = (starValue, reviewStatus, type) => {
        if (reviewStatus === 'reviewed') return;
        
        if (type === 'product') {
            setProductStar(starValue);
        } else if (type === 'service') {
            setServiceStar(starValue)
        }
    }

     

    // validate form
    const validateForm = () => {
        const newErrors = {};
        
        
        // if (formData.firstName.length < 1) {
        // newErrors.newPassword = 'Password must be at least 6 characters';
        // }
        

        // if (formData.email) {
        // !/\S+@\S+\.\S+/.test(formData.email)
        // newErrors.email = 'Email is invalid';
        // }
           
        
        return newErrors;
    };


    const handleSubmitReview = (productId, orderId, reviewStatus) => {
        if (reviewStatus === 'reviewed') return;

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        editReview ({
            productRating: productStar, 
            serviceRating: serviceStar, 
            comment: comment, 
            productId: productId, 
            orderId: orderId 
        }, {
            onSuccess: (data) => {
                console.log('Edit successfull!', data)
                ordersRefetch()
                setProductStar(0)
                setProductHover(0)
                setServiceStar(0)
                setServiceHover(0)
                setComment("")
                setReviewState("reviews")
                
            },
            onError: (error) => {
                console.error('Edit failed: ', error)
                alert('Edit failed. Please try again.')
                
            }
        })
    };

    const handleMouseEnter = (starValue, reviewStatus, type) => {
        if (reviewStatus === 'reviewed') return;
        //console.log("handling mouse enter: ", starValue, reviewStatus, type)
        if (type === 'product') {
            setProductHover(starValue);
        } else if (type === 'service') {
            setServiceHover(starValue)
        }
    };

    const handleMouseLeave = (reviewStatus, type) => {
        if (reviewStatus === 'reviewed') return;
        //console.log("handling mouse leave: ", reviewStatus, type) 
        if (type === 'product') {
            setProductHover(productStar);
        } else if (type === 'service') {
            setServiceHover(serviceStar)
        }
    };

    const handleComment = (e) => {
        setComment(e.target.value)
    }



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
                            <span className="text-lg">You have no pending reviews</span>
                        </div>
                    ) : (   
                    deliveredOrders.map((order) => (
                        order.items.filter((item) => item.reviewStatus === 'notReviewed' ).map(item => 
                            <ReviewCard 
                                key={item._id} 
                                order={order} 
                                item={item} 
                                status={order.status} 
                                deliveryDate={order.deliveryDate} 
                                orderDate={order.orderDate} 
                                trackingNo={order.trackingNumber} 
                                handleReviewDetails={handleReviewDetails} />
                        
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
                            <ReviewCard 
                            key={item._id} 
                            order={order} 
                            item={item} 
                            status={order.status} 
                            deliveryDate={order.deliveryDate} orderDate={order.orderDate} trackingNo={order.trackingNumber} handleReviewDetails={handleReviewDetails} />
                        
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


                <ExpandedReviewCard 
                    reviewOrderDetails={reviewOrderDetails}
                    reviewItemDetails={reviewItemDetails} 
                    handleRating={handleRating}
                    handleSubmitReview={handleSubmitReview} 
                    handleMouseEnter={handleMouseEnter} 
                    handleMouseLeave={handleMouseLeave}
                    serviceHover={serviceHover}
                    productHover={productHover}
                    serviceStar={serviceStar}
                    productStar={productStar}
                    comment={comment}
                    handleComment={handleComment}
                    errors={errors}
                />


                
            </div>
            )}
        </div>
        
    
)}

export default Reviews