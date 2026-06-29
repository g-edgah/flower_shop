import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from '../components/user/common/header.jsx';
import Footer from '../components/user/common/footer.jsx';
import Home from '../pages/user/home.jsx';
import Bouquets from '../pages/user/bouquets.jsx';
import Flowers from '../pages/user/flowers.jsx';
import Design from '../pages/user/design.jsx';
import Colors from '../pages/user/colors.jsx';
import Popular from '../pages/user/popular.jsx';
import CartPage from '../pages/user/cart.jsx';
import TopBar from '../components/user/common/topBar.jsx'
import NavBar from '../components/user/common/navBar.jsx';
import Profile from '../pages/user/profile.jsx';
import Login from '../pages/user/login.jsx';
import Register from '../pages/user/register.jsx';

import { useWishlist, useEditWishlist, useAddCart, useMinusCart, useDeleteCart, useCart } from '../hooks/user/user.js';

const UserLayout = ({ userData, isUserLoading, userError, isUserFetching, userRefetch }) => {

    // console.log('userRefetch type from layout: ', typeof userRefetch);
    // console.log('userRefetch value from layout: ', userRefetch);

    const [ page, setPage ] = useState("")
    const [ profilePage, setProfilePage ] = useState("account")
    const [ cart, setCart ] = useState([]);
    const [ localCart, setLocalCart ] = useState(JSON.parse(localStorage.getItem('cart')) || {
        cart: [], 
        subTotal: 0,
        region: 'nairobi',
        shippingCost: 0,
        grandTotal: 0}
    )
    const [ wishlist, setWishlist ] = useState([]);
    const [ localWishlist, setLocalWishlist ] = useState(JSON.parse(localStorage.getItem('wishlist')) || [])
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
    
    const refreshCart = () => {
        console.log("refreshing cart")
        cartRefetch()
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
                setCart(localCart.cart)
                setSubTotal(localCart?.subTotal);
                setShippingCost(localCart?.shippingCost);
                setTotal(localCart?.grandTotal);
            } catch (error) {
                console.error("error getting cart/wishlist from local storage: ", error)
            }
           
            
        }
    }


    useEffect(() => {
        refreshCart ()
    }, [cartData, localCart])


    const localCartTotals = () => {

        const workingCart = localCart.cart.map( ({ 
            price, quantity
        }) => {
            return { 
                subTotal: price * quantity
            }
        })

        //subTotal
        const localSubTotal = workingCart.reduce((sum, item) => sum + item.subTotal, 0)

        //shipping cost
        const localRegion = "nairobi";

        const localShippingCost = localRegion === 'nairobi' ? 300 : 800

        //grand total
        const localGrandTotal = localSubTotal + localShippingCost

        
        return ({
            subTotal: localSubTotal,
            region: localRegion,
            shippingCost: localShippingCost,
            grandTotal: localGrandTotal
        })
    }

    
    const refreshWishlist = () => {
        wishlistRefetch()
        console.log("refreshing wishlist")
        wishlistRefetch()
        if (wishlistData?.wishlist) {
            console.log("user wishlist data available: ", wishlistData)
            setWishlist(wishlistData?.wishlist)
        } else {
            console.log("user wishlist data not available: ")
            try {
                setWishlist(localWishlist)
            } catch (error) {
                console.error("error getting wishlist from local storage: ", error)
            }
           
            
        }
    }


    useEffect(() => {
        refreshWishlist()
        
    }, [wishlistData, localWishlist])

    

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



    const wishlistLocalToggle = (item) => {
        console.log("layout wishlist")

        let workingWishlist = localWishlist
        const existingItem = workingWishlist.find(wishlistItem =>
            wishlistItem._id === item._id
        )

        if (existingItem) {
            workingWishlist = workingWishlist.filter(wishlistItem => !(wishlistItem._id === item._id));
            

        } else {
            workingWishlist = [...workingWishlist, item];
            
        }
        setLocalWishlist(workingWishlist)
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


    const addToLocalCart = (item) => {


        let workingCart = localCart
        const existingItem = workingCart.cart.find(cartItem =>
            cartItem._id === item._id
        )

        if (existingItem) {
            console.log("item exists: ", item)
            if (existingItem.quantity < 98) {
                existingItem.quantity = (existingItem.quantity) + 1
            }
            if (existingItem.quantity > 99) {
                existingItem.quantity = 99
            }
        } else {
            workingCart.cart.push({
                _id: item._id,
                name: item.name,
                type: item.type,
                price: item.price,
                description: item.description,
                picturePath: item.picturePath,
                quantity: 1
            })
        }

        const {subTotal, region, shippingCost, grandTotal} = localCartTotals()

        workingCart = {
            ...workingCart,
            subTotal: subTotal,
            region: region,
            shippingCost: shippingCost,
            grandTotal: grandTotal
        };

        localStorage.setItem('cart', JSON.stringify(workingCart));
        setLocalCart(workingCart)
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

    const minusFromLocalCart = (item) => {
        let workingCart = localCart
        const existingItem = workingCart.cart.find(cartItem =>
            cartItem._id === item._id && cartItem.type === item.type
        )

        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity = (existingItem.quantity) - 1
            }
            if (existingItem.quantity < 1) {
                existingItem.quantity = 1
            }
        


            const {subTotal, region, shippingCost, grandTotal} = localCartTotals()

            workingCart = {
                ...workingCart,
                subTotal: subTotal,
                region: region,
                shippingCost: shippingCost,
                grandTotal: grandTotal
            };
        

            localStorage.setItem('cart', JSON.stringify(workingCart));
            setLocalCart(workingCart)
        }
        
    }
        
            
    
    const deleteFromCart = (id) => {
        deleteCart({
            productId: id
        }, {
                onSuccess: (data) => {
                    console.log('deleting successfull!', data)
                    cartRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                    
                }
            })
    };

    const deleteFromLocalCart = (id, type) => {
        //console.log("deleting from local cart", id, type)

        let workingCart = localCart

        //console.log("working cart: ", workingCart)
        const existingItem = workingCart.cart.find(cartItem =>
            cartItem._id === id && cartItem.type === type
        )

        //console.log("item exists: ", existingItem)

        if (existingItem) {
            workingCart.cart = workingCart.cart.filter(item => !(item._id === id && item.type === type));
        

            const {subTotal, region, shippingCost, grandTotal} = localCartTotals()

            workingCart = {
                ...workingCart,
                subTotal: subTotal,
                region: region,
                shippingCost: shippingCost,
                grandTotal: grandTotal
            };
            

            localStorage.setItem('cart', JSON.stringify(workingCart));
            setLocalCart(workingCart)
        }
    }

    const handleAddToCart = (item) => {
        if (userData) {
            addToCart(item._id, item.type)

        } else {
            console.log("adding")
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
            deleteFromLocalCart(item._id, item.type)
        }
    }

    const handleWishlistToggle = (item) => {

        //userRefetch()
        if (userData) {
            wishlistToggle(item._id, item.type)
            console.log("userdata wishlist innit: ", userData)
        
        } else {
            wishlistLocalToggle(item)
            console.log("localdata wishlist innit")
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <TopBar />
            <NavBar page={page} setPage={setPage} cart={cart} profilePage={profilePage} />
            
            <Routes>
                <Route index element={<Home setPage={setPage} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />} />

                <Route path='bouquets' element={<Bouquets setPage={setPage} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} cartRefetch={cartRefetch}/>}/>

                <Route path='flowers' element={<Flowers setPage={setPage} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>

                <Route path='design' element={<Design setPage={setPage} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>

                <Route path='popular' element={<Popular setPage={setPage}  handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>
                  
                {/* <Route path='profile/' element={<Profile setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} userRefetch={userRefetch} setCart={setLocalCart} setWishlist={setLocalWishlist} refreshCart={refreshCart} refreshWishlist={refreshWishlist} profilePage={profilePage} setProfilePage={setProfilePage}/>} /> */}

                <Route path='profile/:page' element={<Profile setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} userRefetch={userRefetch} setCart={setLocalCart} setWishlist={setLocalWishlist} refreshCart={refreshCart} refreshWishlist={refreshWishlist} profilePage={profilePage} setProfilePage={setProfilePage}/>} />

                <Route path='cart/*' element={<CartPage setPage={setPage} handleAddToCart={handleAddToCart} handleMinusFromCart={handleMinusFromCart} handleDeleteFromCart={handleDeleteFromCart} cart={cart} subTotal={subTotal} total={total} couponCode={couponCode} setCouponCode={setCouponCode} shippingCost={shippingCost} setShippingCost={setShippingCost} cartRefetch={cartRefetch} cartIsLoading={cartLoading} cartError={cartError}/>}/>

                <Route path='login' element={<Login setPage={setPage} localCart={localCart} setLocalCart={setLocalCart} localWishlist={localWishlist} setLocalWishlist={setLocalWishlist} userRefetch={userRefetch} page={page} cartRefetch={cartRefetch} wishlistRefetch={wishlistRefetch}/>}/>

                <Route path='register' element={<Register setPage={setPage} />}/>

            </Routes>
            
            <Footer />
        </div>
    )
}

export default UserLayout