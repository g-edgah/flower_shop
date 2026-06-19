import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from '../components/common/header.jsx';
import Footer from '../components/common/footer.jsx';
import Home from '../pages/home.jsx';
import Bouquets from '../pages/bouquets.jsx';
import Flowers from '../pages/flowers.jsx';
import Design from '../pages/design.jsx';
import Colors from '../pages/colors.jsx';
import Popular from '../pages/popular.jsx';
import CartPage from '../pages/cart.jsx';
import TopBar from '../components/common/topBar.jsx'
import NavBar from '../components/common/navBar.jsx';
import Profile from '../pages/profile.jsx';
import Login from '../components/profile/login.jsx';
import Register from '../components/profile/register.jsx';

import { useWishlist, useEditWishlist, useAddCart, useMinusCart, useDeleteCart, useCart } from '../hooks/user.js';

const UserLayout = ({ userData, isUserLoading, userError, isUserFetching, userRefetch }) => {
    const [ page, setPage ] = useState("home")
    const [ cart, setCart ] = useState([]);
    const [ wishlist, setWishlist ] = useState([]);
    const [ couponCode, setCouponCode ] = useState('');
    const [ subTotal, setSubTotal ] = useState(0);
    const [ total, setTotal ] = useState(0);
    const [ shippingCost, setShippingCost ] = useState(500);

    const handlePage = (page) => {
        e.preventDefault()
        if (page) {
            setPage(page)
            console.log(page)
        }
    }

    
    //fetching wishlist
    const { data: wishlistData, isLoading: wishlistLoading, error: wishlistError, refetch: wishlistRefetch } = useWishlist();
    //editing wishlist
    const { mutate: editWishlist, isLoading: editWishlistLoading, error: editWishlistError } = useEditWishlist();
    //fetching cart
    const { data: cartData, isLoading: cartLoading, error: cartError, isFetching: cartFetching , refetch: cartRefetch } = useCart();
    //adding to cart
    const { mutate: addCart, isLoading: addCartLoading, error: addCartError } = useAddCart();
    //minusing from cart
    const { mutate: minusCart, isLoading: minusCartLoading, error: minusCartError } = useMinusCart();
    //deleting from cart
    const { mutate: deleteCart, isLoading: deleteCartLoading, error: deleteCartError } = useDeleteCart();
    

    useEffect(() => {
        if (cartData?.formattedCart) {
            console.log("user cart data available: ", cartData?.formattedCart)
            setCart(cartData?.formattedCart)
            setSubTotal(cartData?.subTotal);
            setShippingCost(cartData?.shippingCost);
            setTotal(cartData?.grandTotal);
            //console.log("cart data: ", cartData?.formattedCart);

        } else {
            console.log("user cart data not available: ")
            try {
                const localCart = JSON.parse(localStorage.getItem('cart')) || []

                setCart(localCart)
            } catch (error) {
                console.error("error getting cart/wishlist from local storage: ", error)
            }
           
            
        }
    }, [cartData])

    useEffect(() => {
        if (wishlistData?.wishlist) {
            console.log("user wishlist data available: ", wishlistData)
            setWishlist(wishlistData?.wishlist)
        } else {
            console.log("user wishlist data not available: ")
            try {
                const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || []
                setWishlist(localWishlist)
            } catch (error) {
                console.error("error getting wishlist from local storage: ", error)
            }
           
            
        }
    }, [wishlistData])

    

    const wishlistToggle = (id, type) => {
        console.log("product to wishlist id: ", id)
        editWishlist({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower"
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    wishlistRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                    
                }
            })
    };



    const wishlistLocalToggle = (id, type) => {

        let workingWishlist = wishlist
        const existingItem = workingWishlist.find(item =>
            item.product === id
        )

        if (existingItem) {
            workingWishlist = workingWishlist.filter(item => !(item.product === id));
        } else {
            workingWishlist.push({
                product: id,
                type: type
            })

        }


        localStorage.setItem('wishlist', JSON.stringify(workingWishlist));
    }


    const addToCart = (id, type) => {
        console.log("product to cart id: ", id)
        addCart({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower",
            quantity: 1
        }, {
            onSuccess: (data) => {
                console.log('Edit successfull!', data)
                cartRefetch()
                
            },
            onError: (error) => {
                console.error('Edit failed: ', error)
                alert('Edit failed. Please try again.')
                
            }
        })
    };


    const addToLocalCart = (id, type) => {

        let workingCart = cart
        const existingItem = workingCart.find(item =>
            item.product === id && item.type === type
        )

        if (existingItem) {
            if (existingItem.quantity < 98) {
                existingItem.quantity = (existingItem.quantity) + 1
            }
            if (existingItem.quantity > 99) {
                existingItem.quantity = 99
            }
        } else {
            workingCart.push({
                product: id,
                type: type,
                quantity: 1
            })
        }

        localStorage.setItem('cart', JSON.stringify(workingCart));
    }

    const minusFromCart = (id, type) => {
        minusCart({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower",
            quantity: 1
        }, 
        {
            onSuccess: (data) => {
                console.log('Edit successfull!', data)
                cartRefetch()
                
            },
            onError: (error) => {
                console.error('Edit failed: ', error)
                alert('Edit failed. Please try again.')
                
            }
        })
    };

    const minusFromLocalCart = (id, type) => {
        let workingCart = cart
        const existingItem = workingCart.find(item =>
            item.product === id && item.type === type
        )

        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity = (existingItem.quantity) - 1
            }
            if (existingItem.quantity < 1) {
                existingItem.quantity = 1
            }
        }


        localStorage.setItem('cart', JSON.stringify(workingCart));
        
    }
        
            
    
    const deleteFromCart = (id) => {
        deleteCart({
            productId: id
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    cartRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                    
                }
            })
    };

    const deleteFromLocalCart = (id, type) => {

        let workingCart = cart
        const existingItem = workingCart.find(item =>
            item.product === id && item.type === type
        )

        if (existingItem) {
            workingCart = cart.filter(item => !(item.product === id && item.type === type));
        }


        localStorage.setItem('cart', JSON.stringify(workingCart));
        
        
    }

    const handleAddToCart = (item) => {
        if (userData) {
        addToCart(item._id, item.type)

        
        } else {
        addToLocalCart(item)
        }
    }

    const handleMinusFromCart = (item) => {
        if (userData) {
        minusFromCart(item._id)

        
        } else {
        minusFromLocalCart(item)
        }
    }


    const handleDeleteFromCart = (item) => {
        if (userData) {
        deleteFromCart(item._id)

        
        } else {
        deleteFromLocalCart(item._id)
        }
    }

    const handleWishlistToggle = (item) => {
        if (userData) {
        wishlistToggle(item._id, item.type)

        
        } else {
        wishlistLocalToggle(item)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <TopBar />
            <NavBar page={page} setPage={setPage} cart={cart}/>
            
            <Routes>
                <Route index element={<Home setPage={setPage} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />} />

                <Route path='bouquets' element={<Bouquets setPage={setPage} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} cartRefetch={cartRefetch}/>}/>

                <Route path='flowers' element={<Flowers setPage={setPage} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>

                <Route path='design' element={<Design setPage={setPage} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>

                <Route path='popular' element={<Popular setPage={setPage}  handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>
                  
                <Route path='profile/' element={<Profile setPage={setPage}  handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />} />

                <Route path='profile/:page' element={<Profile setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />} />

                <Route path='cart/*' element={<CartPage setPage={setPage} handleAddToCart={handleAddToCart} handleMinusFromCart={handleMinusFromCart} handleDeleteFromCart={handleDeleteFromCart} cart={cart} subTotal={subTotal} total={total} couponCode={couponCode} setCouponCode={setCouponCode} shippingCost={shippingCost} setShippingCost={setShippingCost} cartRefetch={cartRefetch} cartIsLoading={cartLoading} cartError={cartError}/>}/>

                <Route path='login' element={<Login setPage={setPage} />}/>

                <Route path='register' element={<Register setPage={setPage} />}/>

            </Routes>
            
            <Footer />
        </div>
    )
}

export default UserLayout