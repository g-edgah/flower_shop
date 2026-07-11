import { useNavigate } from "react-router-dom"

const SideBar = ({ profilePage, handleProfilePage }) => {
    const navigate = useNavigate()



    return (
        <div className="flex flex-col gap-1 w-57  mt-8 rounded-lg">
            
            <div className="w-full bg-gray-200 flex flex-col rounded-t-lg">
                <span onClick={() => {
                    navigate("/profile/account")
                    handleProfilePage("account")
                }} className={`rounded-t-lg w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "account" ? "bg-gray-200" : "bg-cartCard"}`}>Account</span>
                <span onClick={() => {
                    navigate("/profile/orders")
                    handleProfilePage("orders")
                }} className={`w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "orders" ? "bg-gray-200" : "bg-cartCard"}`}>Orders</span>
                <span onClick={() => {
                    navigate("/profile/wishlist")
                    handleProfilePage("wishlist")
                }} className={`w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "wishlist" ? "bg-gray-200" : "bg-cartCard"}`}>Wishlist</span>
                <span onClick={() => {
                    navigate("/profile/reviews")
                    handleProfilePage("reviews")
                }} className={`w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "reviews" ? "bg-gray-200" : "bg-cartCard"}`}>Reviews</span>
                <span onClick={() => {
                    navigate("/profile/vouchers")
                    handleProfilePage("vouchers")
                }} className={`w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "vouchers" ? "bg-gray-200" : "bg-cartCard"}`}>Vouchers</span>
            </div>

            <div className="w-full bg-cartCard text-center flex flex-col">
                <span onClick={() => {
                    navigate("/profile/management")
                    handleProfilePage("management")
                }} className={`w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "management" ? "bg-gray-200" : "bg-cartCard"}`}>Account Management</span>
                <span onClick={() => {
                    navigate("/profile/payment")
                    handleProfilePage("payment")
                }} className={`w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "payment" ? "bg-gray-200" : "bg-cartCard"}`}>Payment Settings</span>
                <span onClick={() => {
                    navigate("/profile/address")
                    handleProfilePage("address")
                }} className={`w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "address" ? "bg-gray-200" : "bg-cartCard"}`}>Address Book</span>
            </div>
            
            <div className="w-full bg-cartCard text-center flex flex-col rounded-b-lg">
                <span onClick={() => {
                    navigate("/profile/logout")
                    handleProfilePage("logout")
                }} className={`rounded-b-lg w-full h-13 text-center flex items-center justify-start px-5 hover:bg-gray-200 cursor-pointer ${profilePage == "logout" ? "bg-gray-200" : "bg-cartCard"}`}>Logout</span>
            </div>
        </div>

    )
}

export default SideBar