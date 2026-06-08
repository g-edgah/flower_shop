import { useEffect, useState } from "react";
import { useWishlist } from "../../hooks/user";

import WishlistCard from "./wishlistCard";

const Wishlist = ({ userRefetch, user }) => {

    const { data, isLoading, error, refetch: wishlistRefetch } = useWishlist();

    const wishlistCart = user?.cart || [];
    console.log("user cart from wishlist: ", user.cart)
    console.log("wishlistcart: ", wishlistCart)
    
    

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
                        
                        wishlist.map((item) =>{
                            const carted = wishlistCart?.some(cartItem => cartItem.product?.toString() === item._id?.toString()) || false;
                            
                            return (
                            
                            <WishlistCard 
                                key={item._id} 
                                item={item} 
                                wishlistRefetch={wishlistRefetch} 
                                userRefetch={userRefetch}
                                carted={carted}
                            />
                        )})
                    
                    )
                )}
                </div>
        </div>
    )
}

export default Wishlist