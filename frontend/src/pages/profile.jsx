import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import Header from '../components/common/header.jsx';
import Footer from '../components/common/footer.jsx';
import SideBar from '../components/profile/sidebar.jsx'
import Account from '../components/profile/account.jsx'
import Orders from '../components/profile/orders.jsx'
import Wishlist from '../components/profile/wishlist.jsx'
import Reviews from '../components/profile/reviews.jsx'
import Vouchers from '../components/profile/vouchers.jsx'
import Management from '../components/profile/management.jsx'
import Payment from '../components/profile/payment.jsx'
import Logout from '../components/profile/logout.jsx'


import { useUser } from '../hooks/user.js'


const ProfilePage = ({setPage, userData, isUserLoading, userError, isUserFetching, userRefetch}) => {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId')

    const [ profilePage, setProfilePage ] = useState("account")

    useEffect(() => {
    
            setPage("profile")
            userRefetch()
            navigate(`/profile/${profilePage}`)
    
     }, []);

    const handleProfilePage = (profilePage) => {
        e.preventDefault()
        if (profilePage) {
            setProfilePage(profilePage)
            console.log(profilePage)
        }
    }
     
    if (isUserLoading) return <div>Loading...</div>;
    if (userError) return <div>Error: {userError.message}</div>;


    const user = userData.formattedUser

    console.log(user)
    

    return (
        <div className=" min-h-screen w-full flex  space-x-3 md:space-y-5 items-start justify-center">
            <SideBar profilePage={profilePage} setProfilePage={setProfilePage}/>

            <div className="right w-6/10 max-w-200 bg-cartCard mt-8 rounded-md">
                <Routes>
                    <Route path='account' element={<Account refetch={userRefetch} user={user} />} />
                    <Route path='orders' element={<Orders />} />
                    <Route path='wishlist' element={<Wishlist />} />
                    <Route path='reviews' element={<Reviews />} />
                    <Route path='vouchers' element={<Vouchers />} />
                    <Route path='management' element={<Management />} />
                    <Route path='payment' element={<Payment />} />
                    <Route path='logout' element={<Logout />} />
                </Routes>
            </div>
            {/* <div className="min-h-screen">
                <div className="details">
                        <img
                            src={`${user.picturePath}`} 
                            alt={`${user.firstName}`}
                            className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                    
                </div>
                <div className="auth">

                </div>
            </div> */}
        </div>
    )
}

export default ProfilePage