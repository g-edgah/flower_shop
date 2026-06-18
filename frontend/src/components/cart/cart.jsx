import CartCard from './cartCard.jsx';
import { Link, useNavigate } from 'react-router-dom'

const Cart = ({ cart, subTotal, total, couponCode, setCouponCode, shippingLocation, setShippingLocation, shippingCost, setShippingCost, userRefetch, cartRefetch }) => {
    const navigate = useNavigate();
    console.log('cart from cart:', cart)

    return (
        <div className="min-h-full pt-10 w-full flex flex-col space-y-3 md:space-y-5 items-center">
                    {cart?.length === 0 ? (
                        <div className="emptyCart w-full h-[50vh] flex flex-col items-center space-y-10 justify-center mt-20">
                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-medium">your cart is empty</h2>
                                <p className="text-gray-600">looks like you haven't added anything to your cart yet.</p>
                            </div>
                            
                            <button className="bg-gray-400 w-50 h-10 rounded-lg hover:bg-gray-500 hover:shadow-md transition" onClick={()=> navigate('/bouquets')}>start shopping</button>
                        </div>
                    ) : (
                        <div className='w-full max-w-234 flex flex-col space-y-3 md:space-y-5 items-center'>
                            <div className="productContainer flex flex-col gap-2 justify-start md:gap-4 lg:space-x-12 mx-auto w-full rounded-md">
                                
                                    
                                        {cart.map(
                                            ({
                                                _id,
                                                name,
                                                type,
                                                price,
                                                quantity,
                                                picturePath,
                                            }, index) => (
                                            
                                            <CartCard 
                                                key={index}
                                                id={_id}
                                                name={name}
                                                type={type}
                                                price={price}
                                                quantity={quantity}
                                                image={picturePath}
                                                userRefetch={userRefetch}
                                                cartRefetch={cartRefetch}
                                                
                                            />
                                        ))}
                               
                            </div>
        
                            <div className="summaryContainer flex flex-col w-full max-w-[95vw] mx-auto py-3 px-4 md:p-6 space-y-4 bg-cartSummary font-normal text-md text-summaryText rounded-lg">
                                <div className="cartTotal text-lg">
                                    <span>Sub Total: Ksh </span>
                                    <span className="amount">{subTotal}</span>
                                </div>
        
                                <div className="voucher">
                                    <form ></form>
                                    <input 
                                        className="p-2 bg-white w-50 h-10 rounded-md border text-summaryButtons focus:outline-none border-gray-400"
                                        type="text" 
                                        placeholder="enter your voucher code" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <button className='ml-4 text-summaryButtonsText bg-summaryButtons w-20 h-9.5 md:h-10 rounded-md hover:bg-active transition'>apply</button>
                                </div>
        
                                <div className="payableAmount flex flex-col space-y-2 md:space-y-4">
                                    <span className='text-lg'>Shipping: Ksh {shippingCost}</span>
                                    <span className='font-bold text-xl'>Total: Ksh {total}</span>
                                    <button  onClick={()=> navigate('/cart/checkout')} className='text-summaryButtonsText bg-summaryButtons w-50 h-9.5 md:h-10 rounded-md hover:bg-active transition'>change order details</button>
                                </div>
        
                            </div>
        
                            <div className="cartActions mx-auto justify-center flex flex-row space-x-5 md:space-x-16 text-checkoutButtonsText pr-1 pb-15">
                                <button className="bg-checkoutButtons hover:bg-checkoutButtonsHover hover:bg-gray-450 w-40 md:w-50 h-10 rounded-xl hover:shadow-md hover:shadow-gray-600 transition" onClick={()=> navigate('/')}>continue shopping</button>
                                <button className="bg-summaryButtons w-40 md:w-50 h-10 rounded-xl hover:shadow-md hover:shadow-gray-600 hover:bg-active transition" onClick={()=> navigate('/cart/checkout')}>checkout</button>
                                
                            </div>
                        </div>
                    )}
                </div>
    )
}

export default Cart
