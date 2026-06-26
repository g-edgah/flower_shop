
import { HiStar, HiOutlineStar } from "react-icons/hi2";
import { useState } from 'react'


const ExpandedReviewCard = ({ reviewOrderDetails, reviewItemDetails, handleRating, handleSubmitReview , handleMouseEnter, handleMouseLeave,serviceHover, productHover, serviceStar, productStar, comment, handleComment, errors }) => {

    console.log("review item expanded: ", reviewItemDetails)
    console.log("review order expanded: ", reviewOrderDetails)

   

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="details flex flex-col gap-2 border-[1.5px] border-gray-400 rounded-md p-3 bg-gray-200">
                <span className="number font-bold mb-2 pt-2">Order NO {reviewOrderDetails?.trackingNumber}</span>
                <span className="status">Status: {reviewOrderDetails?.status}</span>
                <span className="orderDate">Order Date: {new Date(reviewOrderDetails?.orderDate).toLocaleDateString()}</span>
                <span className="deliveryDate">Delivery Date: {new Date(reviewOrderDetails?.deliveryDate).toLocaleDateString()}</span>
                <span className="itemsTitle font-semibold text-md mt-3">Items: {reviewOrderDetails?.items?.length || 0}</span>
            </div>

            <div className="items flex flex-col gap-3">
                    <div  className="item flex gap-5 items-start justify-between border-[1.5px] border-gray-400 rounded-md p-3 bg-gray-200">
                        <div className="img w-42 h-53 mt-4">
                            <img
                                src={`/${reviewItemDetails.product.picturePath}`}
                                alt={`${reviewItemDetails.name}`}
                                className="rounded-md w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/default-product.png';
                                }}
                            />
                        </div>
                        <div className="info w-[calc(100%-172px)] flex flex-col gap-3 text-[15px] text-gray-800 ">
                            <span className="name font-semibold text-lg text-black mt-2">{reviewItemDetails.name}</span>
                            <span className="quantity">Rate this product</span>
                            <div className="stars flex">
                                {[1, 2, 3, 4, 5 ].map((star, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => handleRating(star, reviewItemDetails?.reviewStatus, 'product')}
                                        onMouseEnter={() => handleMouseEnter(star, reviewItemDetails?.reviewStatus, 'product')}
                                        onMouseLeave={() => {handleMouseLeave(reviewItemDetails?.reviewStatus, 'product')}}
                                        
                                        className={`flex cursor-pointer`}>
                                            <HiStar className={`size-6  
                                                ${(productHover >= star) ? 'text-summaryButtons': 'text-gray-400'} `}/>
                                    </button> 
                                ))} 

                            </div>
                            <span className="price mt-4">Rate the service delivery</span>
                            <div className="stars flex">
                                {[1, 2, 3, 4, 5 ].map((star, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => handleRating(star, reviewItemDetails?.reviewStatus, 'service')}
                                        onMouseEnter={() => handleMouseEnter(star, reviewItemDetails?.reviewStatus, 'service')}
                                        onMouseLeave={() => {handleMouseLeave(reviewItemDetails?.reviewStatus, 'service')}}
                                        
                                        className={`5 flex cursor-pointer`}>
                                            <HiStar className={`size-6 
                                                ${(serviceHover >= star) ? 'text-summaryButtons': 'text-gray-400'} `}/>
                                    </button> 
                                ))} 

                            </div>
                            <span className="text mt-4">Leave a comment</span>
                            <textarea
                                    className={`w-full min-h-50 pl-4 pr-2 py-1.5 border ${errors?.comment ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                    type="text" 
                                    id='info' 
                                    name='comment'
                                    value={comment}
                                    onChange={(e) => {handleComment(e)}}
                                    placeholder="Please tell us your thoughts and comments"
                                />
                        </div>
                    </div>
                
            </div>
            <button className="detail cursor-pointer flex bg-summaryButtons hover:bg-active rounded-md p-2 text-white items-center justify-center" onClick={()=>{handleSubmitReview(reviewItemDetails?.product?._id, reviewOrderDetails?._id, reviewItemDetails?.reviewStatus)}}>
                <span>submit</span>
            </button>
        </div>
    )
}

export default ExpandedReviewCard