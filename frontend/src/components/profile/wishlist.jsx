import { useEffect, useState } from "react";
import { useWishlist } from "../../hooks/user";

import WishlistCard from "./wishlistCard";

const Wishlist = ({ cartRefetch, user, handleAddToCart, handleWishlistToggle, cart, wishlist, wishlistLoading, wishlistError }) => {


    
    
    console.log("wishlist data: ", wishlist)

    return (
        <div className='p-3 flex flex-col gap-5'>
                <div className="title border-b border-gray-300 w-10/10 p-3">
                    <span className="title text-xl font-bold ">Wishlist</span>
                </div>
                
                <div className="cont flex flex-col gap-3">
                {wishlistLoading && <span>fetching wishlist</span>}
                {wishlistError && <span>error fetching wishlist: {error.message}</span>}
                {wishlist && (
                    (wishlist.length === 0) ? (
                        <div className="w-full h-40 flex flex-col items-center justify-center gap-3">
                            <span className="text-lg">No wishlist items found.</span>
                        </div>
                    ) : (  
                        
                        wishlist.map((item) =>{
                            const carted = cart?.some(cartItem => cartItem?._id?.toString() === item._id?.toString()) || false;
                            
                            return (
                            
                            <WishlistCard 
                                key={item._id} 
                                item={item} 
                                handleWishlistToggle={handleWishlistToggle}
                                handleAddToCart={handleAddToCart}
                                carted={carted}
                                handle
                            />
                        )})
                    
                    )
                )}
                </div>
        </div>
    )
}

export default Wishlist