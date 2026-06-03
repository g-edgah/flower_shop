import { useEffect, useState } from "react";
import { useWishlist } from "../../hooks/user";

const Wishlist = ({ refetch, user }) => {

    const { data, isLoading, error, userdata } = useWishlist();
    
    if (data) {
        console.log("wishlist data: ", data)
    }

    return (
        <div className='p-3'>
                <div className="title border-b border-gray-300 w-10/10 p-3">
                    <span className="title text-xl font-bold ">Wishlist</span>
                </div>
        </div>
    )
}

export default Wishlist