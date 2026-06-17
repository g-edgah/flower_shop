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

import { useEditWishlist, useAddCart } from '../hooks/user.js';

const UserLayout = ({ userData, isUserLoading, userError, isUserFetching, userRefetch }) => {
    const [page, setPage] = useState("home")
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    const handlePage = (page) => {
        e.preventDefault()
        if (page) {
            setPage(page)
            console.log(page)
        }
    }

    const { mutate: editWishlist, isLoading: wishlistLoading, error: wishlistError } = useEditWishlist();
    const { mutate: addCart, isLoading: cartLoading, error: cartError } = useAddCart();

    useEffect(() => {
        if (userData?.formattedUser) {
            console.log("user data available: ", userData?.formattedUser?.cart)
            setCart(userData?.formattedUser?.cart)
            setWishlist(userData?.formattedUser?.wishlist)
        } else {
            console.log("user data not available: ")
            try {
                const localCart = JSON.parse(localStorage.getItem('cart')) || []
                const localWishlist = JSON.parse(localStorage.getItem('wishlist')) || []

                setCart(localCart)
                setWishlist(localWishlist)
            } catch (error) {
                console.error("error getting cart/wishlist from local storage: ", error)
            }
           
            
        }
    })
    

    const wishlistToggle = (id, type) => {
        console.log("product to wishlist id: ", id)
        editWishlist({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower"
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    userRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                    
                }
            })
    };

    const addToCart = (id, type) => {
        console.log("product to cart id: ", id)
        addCart({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower",
            quantity: 1
        }, {
            onSuccess: (data) => {
                console.log('Edit successfull!', data)
                userRefetch()
                
            },
            onError: (error) => {
                console.error('Edit failed: ', error)
                alert('Edit failed. Please try again.')
                
            }
        })
    };

    const wishlistLocalToggle = (id, type) => {

    }

    const addToLocalCart = (id, type) => {
        const existingItem = cart.find(item =>
            item,product === id && item.type === type
        )

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity) + 1
        } else {
            cart.push({
                product: id,
                type: type,
                quantity: 1
            })
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    const minusFromLocalCart = (id, type) => {
        const existingItem = cart.find(item =>
            item,product === id && item.type === type
        )

        if (existingItem) {
            if (existingItem.quantity > 1) {
                existingItem.quantity = (existingItem.quantity) - 1
            }
        } else {
            cart.push({
                product: id,
                type: type,
                quantity: 1
            })
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        
    }

    const deleteFromLocalCart = (id, type) => {
        
    }

    const handleAddToCart = (id, type) => {
        if (userData) {
        addToCart(id, type)

        
        } else {
        addToLocalCart(id, type)
        }
    }

    const handleDeleteFromCart = (id, type) => {
        if (userData) {
        deleteFromCart(id, type)

        
        } else {
        deleteFromLocalCart(id, type)
        }
    }

    const handleWishlistToggle = (id, type) => {
        if (userData) {
        wishlistToggle(id, type)

        
        } else {
        wishlistLocalToggle(id, type)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <TopBar />
            <NavBar page={page} setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle}/>
            
            <Routes>
                <Route index element={<Home setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />} />

                <Route path='bouquets' element={<Bouquets setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>

                <Route path='flowers' element={<Flowers setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>

                <Route path='design' element={<Design setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>

                <Route path='popular' element={<Popular setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>
                  
                <Route path='profile/' element={<Profile setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />} />

                <Route path='profile/:page' element={<Profile setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />} />

                <Route path='cart/*' element={<CartPage setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} handleAddToCart={handleAddToCart} handleWishlistToggle={handleWishlistToggle} cart={cart} wishlist={wishlist} />}/>

                <Route path='login' element={<Login setPage={setPage} />}/>

                <Route path='register' element={<Register setPage={setPage} />}/>

            </Routes>
            
            <Footer />
        </div>
    )
}

export default UserLayout