import { useEffect, useState } from 'react'
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


const ProfilePage = ({setPage}) => {
    const userId = localStorage.getItem('userId')

    const [ profilePage, setProfilePage ] = useState("account")

    useEffect(() => {
    
            setPage("profile")
    
     }, []);

    const handleProfilePage = (profilePage) => {
        e.preventDefault()
        if (profilePage) {
            setProfilePage(profilePage)
            console.log(profilePage)
        }
    }

    const { data, isLoading, error, isFetching, refetch } = useUser(userId);
     
     
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    const user = data.formattedUser
    //console.log(user.picturePath)
    

    return (
        <div className=" min-h-screen w-full flex  space-x-3 md:space-y-5 items-start justify-center">
            <SideBar profilePage={profilePage} setProfilePage={setProfilePage}/>

            <div className="right w-6/10 max-w-200 bg-cartCard mt-8 rounded-md">
                {profilePage === "account" && (<Account />)}
                {profilePage === "orders" && (<Orders />)}
                {profilePage === "wishlist" && (<Wishlist />)}
                {profilePage === "reviews" && (<Reviews />)}
                {profilePage === "vouchers" && (<Vouchers />)}
                {profilePage === "management" && (<Management />)}
                {profilePage === "payment" && (<Payment />)}
                {profilePage === "logout" && (<Logout />)}
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