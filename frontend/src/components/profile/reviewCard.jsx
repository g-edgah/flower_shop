

const ReviewCard = ({ order, status, trackingNo, deliveryDate, orderDate, item, handleReviewDetails }) => {
    //console.log("order: ", order)
    const { name, price, picturePath } = item.product;

    return (
        <div className="order-card relative bg-gray-200 p-3 border-[1.5px] border-gray-400 rounded-md flex gap-2 justify-between">
            <div className="order-info flex gap-5">
                <div className="img size-32">
                    <img
                        src={`/${picturePath}`}
                        alt={`${name}`}
                        className="rounded-md w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/default-product.png';
                        }}
                    />
                </div>
                <div className="info flex flex-col gap-1 justify-between text-[15px] text-gray-800">

                    <span className="name font-semibold text-lg text-black">{name}</span>
                    <span className="tracking">Order {trackingNo}</span>
                    <span>Status: {status}</span>
                    <span>Delivery Date: {new Date(deliveryDate).toLocaleDateString()}</span>
                    
                    
                </div>
            </div>
            <button className="details text-summaryButtons  h-10 w-42 rounded-md px-2 absolute right-0 top-1.75">
                <span  className="detail cursor-pointer  hover:underline" onClick={() => handleReviewDetails(order, "details")}>review/rate order</span>
            </button>
        </div>
    );
};

export default ReviewCard;