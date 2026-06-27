import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import HomePage from './pages/home.jsx';
import CartPage from './pages/cart.jsx';

import UserLayout from './layout/userLayout.jsx'
import AdminLayout from './layout/adminLayout.jsx'

import { useUser } from './hooks/user.js';



function App() {
  const location = useLocation();

  const { data: userData, isLoading: isUserLoading, error: userError, isFetching: isUserFetching, refetch: userRefetch } = useUser();
  
  useEffect(() => {
        // rcroll to top on every route change
        window.scrollTo(0, 0);
        console.log("location changed: ", location.pathname)
    }, [location.pathname]); // Trigger when path changes

  // if (userData) {
  //   console.log("user at app: ",userData)
  //   const userCart = userData.formattedUser.cart
  //   const userWishlist = userData.formattedUser.wishlist
  // }

  return (
  
      <Routes>
        <Route path='/*' element={<UserLayout userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} />}/>
        <Route path='/admin/*' element={<AdminLayout/>}/>
      </Routes>
  
  )
}

export default App
