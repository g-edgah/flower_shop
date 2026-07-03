import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';

import CartHeader from '../../components/user/cart/cartHeader.jsx';
import Footer from '../../components/user/common/footer.jsx';
import Cart from '../../components/user/cart/cart.jsx';
import Checkout from '../../components/user/cart/checkout.jsx';

import { useCart } from '../../hooks/user/user.js';

const CartPage = ({userData, setPage, cart, cartRefetch, cartLoading, cartError, subTotal, total, couponCode, setCouponCode, shippingCost, setShippingCost, handleAddToCart, handleMinusFromCart, handleDeleteFromCart, userRefetch }) => {
    const navigate = useNavigate();


    useEffect(() => {
        setPage("cart")
    }, [])

    const user = userData?.formattedUser

    console.log("user from cart: ", user)
    
    
    
   // const populatedCart = cartData.formattedCart;
    // console.log("user cart: ",data);
    // console.log("formatted cart: ", formattedCart)

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-between">
            <Routes>
                <Route path='/' element={<Cart cart={cart} subTotal={subTotal} total={total} couponCode={couponCode} setCouponCode={setCouponCode} shippingCost={shippingCost} setShippingCost={setShippingCost} user={user} cartRefetch={cartRefetch} handleAddToCart={handleAddToCart} handleMinusFromCart={handleMinusFromCart} handleDeleteFromCart={handleDeleteFromCart} userRefetch={userRefetch}/>} />
                <Route path='checkout' element={<Checkout cart={cart} subTotal={subTotal} total={total} couponCode={couponCode} setCouponCode={setCouponCode} shippingCost={shippingCost} setShippingCost={setShippingCost} user={user} cartRefetch={cartRefetch} userRefetch={userRefetch} />} />

            </Routes>
        </div>
    )
}

export default CartPage