import { useEffect, useState } from "react";
import { useWishlist } from "../../hooks/user";

import WishlistCard from "./wishlistCard";

const Wishlist = ({ userRefetch, user }) => {

    const { data, isLoading, error, refetch: wishlistRefetch } = useWishlist();
    
    

    const wishlist = data?.wishlist
    console.log("wishlist data: ", wishlist)

    return (
        <div className='p-3 flex flex-col gap-5'>
                <div className="title border-b border-gray-300 w-10/10 p-3">
                    <span className="title text-xl font-bold ">Wishlist</span>
                </div>
                
                <div className="cont flex flex-col gap-3">
                {isLoading && <span>fetching wishlist</span>}
                {error && <span>error fetching wishlist: {error.message}</span>}
                {data && data.wishlist && (
                    (wishlist.length === 0) ? (
                        <div className="w-full h-40 flex flex-col items-center justify-center gap-3">
                            <span className="text-lg">No wishlist items found.</span>
                        </div>
                    ) : (  
                        
                        wishlist.map((item) =>(
                            <WishlistCard key={item._id} item={item} wishlistRefetch={wishlistRefetch} userRefetch={userRefetch}/>
                        ))
                    
                    )
                )}
                </div>
        </div>
    )
}

export default Wishlist