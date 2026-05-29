import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './pages/home.jsx';
import CartPage from './pages/cart.jsx';

import UserLayout from './layout/userLayout.jsx'
import AdminLayout from './layout/adminLayout.jsx'
import ProfileLayout from './layout/profile.jsx'

import { useUser } from './hooks/user.js';



function App() {
  const { data: userData, isLoading: isUserLoading, error: userError, isFetching: isUserFetching, refetch: userRefetch } = useUser();
  
  // if (userData) {
  //   console.log("user at app: ",userData)
  //   const userCart = userData.formattedUser.cart
  //   const userWishlist = userData.formattedUser.wishlist
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<UserLayout userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} />}/>
        <Route path='/admin/*' element={<AdminLayout/>}/>
        <Route path='/profile/*' element={<ProfileLayout userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
