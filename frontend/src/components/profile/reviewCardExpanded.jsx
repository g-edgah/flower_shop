
import { HiStar, HiOutlineStar } from "react-icons/hi2";


const ExpandedReviewCard = ({ reviewOrderDetails, reviewItemDetails, handleRating, handleSubmitReview , handleMouseEnter, handleMouseLeave,serviceHover, productHover, serviceStar, productStar }) => {

    // console.log("review item expanded: ", reviewItemDetails)
    // console.log("review order expanded: ", reviewOrderDetails)

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
                                {[1, 2, 3, 4, 5 ].map((star, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => handleRating(star, reviewItemDetails?.reviewStatus, 'product')}
                                        onMouseEnter={() => handleMouseEnter(star, reviewItemDetails?.reviewStatus, 'product')}
                                        onMouseLeave={() => {handleMouseLeave(reviewItemDetails?.reviewStatus, 'product')}}
                                        
                                        className={`flex cursor-pointer`}>
                                            <HiStar className={`size-7 
                                                ${(productStar >= star )? 'text-summaryButtons': ''} 
                                                ${(productHover >= star) ? 'text-summaryButtons': ''} `}/>
                                    </button> 
                                ))} 

                            </div>
                            <span className="price">Rate the service delivery</span>
                            <div className="stars flex">
                                {[1, 2, 3, 4, 5 ].map((star, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => handleRating(star, reviewItemDetails?.reviewStatus, 'service')}
                                        onMouseEnter={() => handleMouseEnter(star, reviewItemDetails?.reviewStatus, 'service')}
                                        onMouseLeave={() => {handleMouseLeave(reviewItemDetails?.reviewStatus, 'service')}}
                                        
                                        className={`5 flex cursor-pointer`}>
                                            <HiStar className={`size-7 
                                                ${(serviceStar >= star )? 'text-summaryButtons': ''} 
                                                ${(serviceHover >= star) ? 'text-summaryButtons': ''} `}/>
                                    </button> 
                                ))} 

                            </div>
                        </div>
                    </div>
                
            </div>
            <button className="detail flex bg-summaryButtons rounded-md p-2 text-white items-center justify-center">
                <span>submit</span>
                
            </button>
        </div>
    )
}

export default ExpandedReviewCard