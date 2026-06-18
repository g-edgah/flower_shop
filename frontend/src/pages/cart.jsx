import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';

import CartHeader from '../components/cart/cartHeader.jsx';
import Footer from '../components/common/footer.jsx';
import Cart from '../components/cart/cart.jsx';
import Checkout from '../components/cart/checkout.jsx';

import { useCart } from '../hooks/user.js';

const CartPage = ({userData, setPage, isUserLoading, userError, isUserFetching, userRefetch, cart, cartRefetch, cartLoading, cartError, subTotal, total, couponCode, setCouponCode, shippingCost, setShippingCost}) => {
    const navigate = useNavigate();


    useEffect(() => {
        setPage("cart")
        userRefetch()
        cartRefetch()
    }, [])

    const user = userData?.formattedUser
    

    if (cartLoading) return <div>Loading first time...</div>;
    if (cartError) return <div>Error: {cartError.message}</div>;
    
    
   // const populatedCart = cartData.formattedCart;
    // console.log("user cart: ",data);
    // console.log("formatted cart: ", formattedCart)

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-between">
            <Routes>
                <Route path='/' element={<Cart cart={cart} subTotal={subTotal} total={total} couponCode={couponCode} setCouponCode={setCouponCode} shippingCost={shippingCost} setShippingCost={setShippingCost} user={user} userRefetch={userRefetch} cartRefetch={cartRefetch} />} />
                <Route path='checkout' element={<Checkout cart={cart} subTotal={subTotal} total={total} couponCode={couponCode} setCouponCode={setCouponCode} shippingCost={shippingCost} setShippingCost={setShippingCost} user={user} userRefetch={userRefetch} cartRefetch={cartRefetch} />} />

            </Routes>
        </div>
    )
}

export default CartPage