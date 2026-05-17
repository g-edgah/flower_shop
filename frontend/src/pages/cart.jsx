import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import CartHeader from '../components/cart/cartHeader.jsx';
import CartCard from '../components/cart/cartCard.jsx';
import Footer from '../components/common/footer.jsx';

const CartPage = ({setPage}) => {
    const Navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [cartTotal, setCartTotal] = useState(0);
    const [totalPayable, setTotalPayable] = useState(0);
    const [shippingLocation, setShippingLocation] = useState('');
    const [shippingCost, setShippingCost] = useState(0);

    useEffect(() => {
        //ensures page is set to popular when navigation is through other channels apart from button clicking such as navigating back 
        setPage("cart")
    }, [])

    //mock cart items for use in frontend design
    const sampleCartItems = [
        {
            id: 1,
            name: 'pink roses bouquet',
            price: 2900,
            quantity: 2,
            tags: {type: 'roses', color: 'pink', bundling: 'bouquet'},
            image: 'pink_roses_bouquet.png',
        },
        {
            id: 2,
            name: 'pink roses bouquet',
            price: 2900,
            quantity: 2,
            tags: {type: 'roses', color: 'pink', bundling: 'bouquet'},
            image: 'pink_roses_bouquet.png',
        },
        {
            id: 3,
            name: 'pink roses bouquet',
            price: 2900,
            quantity: 2,
            tags: {type: 'roses', color: 'pink', bundling: 'bouquet'},
            image: 'pink_roses_bouquet.png',
        },
        {
            id: 4,
            name: 'pink roses bouquet',
            price: 2900,
            quantity: 2,
            tags: {type: 'roses', color: 'pink', bundling: 'bouquet'},
            image: 'pink_roses_bouquet.png',
        },
        {
            id: 5,
            name: 'pink roses bouquet',
            price: 2900,
            quantity: 2,
            tags: {type: 'roses', color: 'pink', bundling: 'bouquet'},
            image: 'pink_roses_bouquet.png',
        },
        {
            id: 6,
            name: 'pink roses bouquet',
            price: 2900,
            quantity: 2,
            tags: {type: 'roses', color: 'pink', bundling: 'bouquet'},
            image: 'pink_roses_bouquet.png',
        }
    ]

    const handleDelete = (productId) => {
        //logic to handle deleting items from cart
        console.log("deleted")
    }

    const handleChangeQuantity = (change, productId) => {
        // Logic to change quantity of cart item
        if (change === 0) {
            console.log("minus")
        } else if (change=1) {
            console.log("plus")
        }
    }

    const getCartTotal = () => {
        // Logic to calculate cart total
    }

    const getTotalAmount = () => {
        // Logic to calculate total amount
    }

    const handleCoupon = (e) => {
        e.preventDefault();
        // Logic to apply coupon
        getTotalAmount();
    }

    const handleCheckout = () => {
        // Logic to handle checkout
    }


    const getCartItems = () => {
        // Logic to fetch cart items
    }

    useEffect(() => {
        getCartItems();
    }, []);


    return (
    <div className="min-h-full pt-10 w-full flex flex-col space-y-3 md:space-y-5 items-center">
            {sampleCartItems.length === 0 ? (
                <div className="emptyCart w-full h-[50vh] flex flex-col items-center space-y-10 justify-center mt-20">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-medium">your cart is empty</h2>
                        <p className="text-gray-600">looks like you haven't added anything to your cart yet.</p>
                    </div>
                    
                    <button className="bg-gray-400 w-50 h-10 rounded-lg hover:bg-gray-500 hover:shadow-md hover:shadow-black transition" onClick={()=> Navigate('/')}>start shopping</button>
                </div>
            ) : (
                <div className='w-full max-w-234 flex flex-col space-y-3 md:space-y-5 items-center'>
                    <div className="productContainer flex flex-col gap-2 justify-start md:gap-4 lg:space-x-12 mx-auto w-full rounded-md">
                        
                            
                                {sampleCartItems.map(
                                    ({
                                        id,
                                        name,
                                        price,
                                        quantity,
                                        image,
                                    }) => (
                                    <CartCard 
                                        key={id}
                                        itemId={id}
                                        name={name}
                                        price={price}
                                        quantity={quantity}
                                        image={image}
                                        handleChangeQuantity={handleChangeQuantity}
                                        handleDelete={handleDelete}
                                    />
                                ))}
                       
                    </div>

                    <div className="summaryContainer flex flex-col w-full max-w-[95vw] mx-auto py-3 px-4 md:p-6 space-y-2 bg-cartSummary font-normal text-md text-summaryText rounded-lg">
                        <div className="cartTotal">
                            <span>cart total: {cartTotal}</span>
                        </div>

                        <div className="coupon">
                            <form onSubmit={handleCoupon}></form>
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
                            <span>total payable: {totalPayable}</span>
                            <button className='text-summaryButtonsText bg-summaryButtons w-50 h-9.5 md:h-10 rounded-md hover:bg-active transition'>change order details</button>
                        </div>

                    </div>

                    <div className="cartActions mx-auto justify-center flex flex-row space-x-5 md:space-x-16 text-checkoutButtonsText pr-1 pb-15">
                        <button className="bg-checkoutButtons hover:bg-checkoutButtonsHover hover:bg-gray-450 w-40 md:w-50 h-10 rounded-xl hover:shadow-md hover:shadow-gray-600 transition" onClick={()=> Navigate('/')}>continue shopping</button>
                        <button className="bg-summaryButtons w-40 md:w-50 h-10 rounded-xl hover:shadow-md hover:shadow-gray-600 hover:bg-active transition">checkout</button>
                        
                    </div>
                </div>
            )}
        </div> 
    )
}

export default CartPage