import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';

import CartHeader from '../components/cart/cartHeader.jsx';
import Footer from '../components/common/footer.jsx';
import Cart from '../components/cart/cart.jsx';
import Checkout from '../components/cart/checkout.jsx';

import { useCart } from '../hooks/user.js';

const CartPage = ({setPage, isUserLoading, userError, isUserFetching, userRefetch}) => {
    const navigate = useNavigate();
    const [ cart, setCart ] = useState([]);
    const [ couponCode, setCouponCode ] = useState('');
    //const [ subTotal, setSubTotal ] = useState(0);
    const [ total, setTotal ] = useState(0);
    const [ shippingLocation, setShippingLocation ] = useState('');
    const [shippingCost, setShippingCost] = useState(0);




    useEffect(() => {
        setPage("cart")
    }, [])


    const { itemTotals, subTotal } = useMemo(() => {
        const totals = cart.map(item => ({
            ...item,
            subtotal: item.price * item.quantity
        }));
        return {
            itemTotals: totals,
            subTotal: totals.reduce((sum, item) => sum + item.subtotal, 0)
        };
    }, [cart]);

    
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
                <Route path='checkout' element={<Cart cart={cart} subTotal={subTotal} total={total} couponCode={couponCode} setCouponCode={setCouponCode} shippingLocation={shippingLocation} setShippingLocation={setShippingLocation} shippingCost={shippingCost} setShippingCost={setShippingCost} userRefetch={userRefetch} refetch={refetch} />} />
                <Route path='/' element={<Checkout cart={cart} subTotal={subTotal} total={total} couponCode={couponCode} setCouponCode={setCouponCode} shippingLocation={shippingLocation} setShippingLocation={setShippingLocation} shippingCost={shippingCost} setShippingCost={setShippingCost} userRefetch={userRefetch} refetch={refetch} />} />

            </Routes>
        </div>
    )
}

export default CartPage