import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';

import CartHeader from '../components/cart/cartHeader.jsx';
import Footer from '../components/common/footer.jsx';
import Cart from '../components/cart/cart.jsx';
import Checkout from '../components/cart/checkout.jsx';

import { useCart } from '../hooks/user.js';

const CartPage = ({userData, setPage, isUserLoading, userError, isUserFetching, userRefetch}) => {
    const navigate = useNavigate();
    const [ cart, setCart ] = useState([]);
    const [ couponCode, setCouponCode ] = useState('');
    //const [ subTotal, setSubTotal ] = useState(0);
    const [ total, setTotal ] = useState(0);
    const [ shippingLocation, setShippingLocation ] = useState('');
    const [shippingCost, setShippingCost] = useState(500);




    useEffect(() => {
        setPage("cart")
    }, [])

    const user = userData.formattedUser


    const { itemTotals, subTotal, grandTotal } = useMemo(() => {
        const totals = cart.map(item => ({
            ...item,
            subtotal: item.price * item.quantity
        }));
        return {
            itemTotals: totals,
            subTotal: totals.reduce((sum, item) => sum + item.subtotal, 0),
            grandTotal: totals.reduce((sum, item) => sum + item.subtotal, 0) + shippingCost
        };
    }, [cart, shippingCost]);

    
    const { data, isLoading, error, isFetching, refetch } = useCart();

    useEffect(() => {
        if (data) {
            setCart(data.formattedCart);
            console.log("cart data: ", data.formattedCart);
        }
    }, [data]);

    if (isLoading) return <div>Loading first time...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    const { banners, formattedCart, stats } = data;
    

  
    
   // const populatedCart = cartData.formattedCart;
    // console.log("user cart: ",data);
    // console.log("formatted cart: ", formattedCart)

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-between">
            <Routes>
                <Route path='/' element={<Cart cart={cart} subTotal={subTotal} total={grandTotal} couponCode={couponCode} setCouponCode={setCouponCode} shippingLocation={shippingLocation} setShippingLocation={setShippingLocation} shippingCost={shippingCost} setShippingCost={setShippingCost} user={user} userRefetch={userRefetch} refetch={refetch} />} />
                <Route path='checkout' element={<Checkout cart={cart} subTotal={subTotal} total={grandTotal} couponCode={couponCode} setCouponCode={setCouponCode} shippingLocation={shippingLocation} setShippingLocation={setShippingLocation} shippingCost={shippingCost} setShippingCost={setShippingCost} user={user} userRefetch={userRefetch} refetch={refetch} />} />

            </Routes>
        </div>
    )
}

export default CartPage