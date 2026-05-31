

const Checkout = ({ cart, subTotal, total, couponCode, setCouponCode, shippingLocation, setShippingLocation, shippingCost, setShippingCost, userRefetch, refetch }) => {
    return (
        <div className="summaryContainer flex flex-col w-full max-w-[95vw] mx-auto py-3 px-4 md:p-6 space-y-4 bg-cartSummary font-normal text-md text-summaryText rounded-lg">
            <div className="cartTotal text-[22px]">
                <span>sub total: </span>
                <span className="amount">{subTotal}</span>
            </div>

            <div className="coupon">
                <form ></form>
                <input 
                    className="p-2 bg-white w-50 h-10 rounded-md border text-summaryButtons focus:outline-none border-gray-400"
                    type="text" 
                    placeholder="enter your coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                />
                <button className='ml-4 text-summaryButtonsText bg-summaryButtons w-20 h-9.5 md:h-10 rounded-md hover:bg-active transition'>apply</button>
            </div>

            <div className="payableAmount flex flex-col space-y-2 md:space-y-4">
                <span>shipping to {shippingLocation}: {shippingCost}</span>
                <span>Total: {total}</span>
                <button className='text-summaryButtonsText bg-summaryButtons w-50 h-9.5 md:h-10 rounded-md hover:bg-active transition'>change order details</button>
            </div>

        </div>
    )
}

export default Checkout