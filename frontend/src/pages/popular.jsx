import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import FlowerCard from '../components/common/flowerCard.jsx'

import { usePopular } from '../hooks/products.js';
import { use } from "react";

const Popular = ({ setPage, userData, isUserLoading, userError, isUserFetching, userRefetch}) => {
    const [pageNo, setPageNo] = useState(1)

    useEffect(() => {
        //ensures page is set to popular when navigation is through other channels apart from button clicking such as navigating back 
        setPage("popular")
        userRefetch()
    }, [])


    const { data, isLoading, error, isFetching, refetch } = usePopular(pageNo);

    const wishlist = userData?.formattedUser?.wishlist || [];
    const cart = userData?.formattedUser?.cart || [];

    return (
        <div className='flex justify-center'>
            <div className="boquets flex flex-col space-y-5 items-center max-w-250 pb-10">
                <div className="flower-row py-10 flex gap-5 w-full  flex-wrap justify-center items-center max-w-300">
                
                    {isLoading && (
                        <div>Loading first time...</div>
                    )}

                    { error && (
                        <div>Error: {error.message}</div>
                    )}


                    {data && (
                    <div className="flower-row pb-10 flex gap-5 w-full  flex-wrap justify-center items-center max-w-300">
                    
                        {data.products.map(({ _id, name, price, picturePath }, index) => {
                            const liked = wishlist?.some(item => item?.toString() === _id?.toString()) || false;
                            const carted = cart?.some(item => item.product?.toString() === _id?.toString()) || false;
                                
                            return (
                                
                                <FlowerCard
                                id={_id}
                                key={index} 
                                name={name}
                                price={price}
                                image={picturePath}
                                liked={liked}
                                carted={carted}
                                userRefetch={userRefetch}
                                />
                            )})}
                        
                    </div>
                    )}
                </div>
                <div className="pages flex gap-1">
                    <div className="size-9 border-1 flex justify-center items-center rounded-sm hover:bg-footer hover:text-white hover:border-0" onClick={() => setPageNo(1)}><MdOutlineKeyboardDoubleArrowLeft /></div>
                    <div className="size-9 border-1 flex justify-center items-center rounded-sm hover:bg-footer hover:text-white hover:border-0" onClick={() => pageNo > 1 && setPageNo(pageNo - 1)}><MdKeyboardArrowLeft /></div>
                    <div className="size-9 flex justify-center items-center rounded-sm text-white font-bold bg-footer">{pageNo}</div>
                    <div className="size-9 border-1 flex justify-center items-center rounded-sm hover:bg-footer hover:text-white hover:border-0" onClick={() => setPageNo(pageNo + 1)}><MdKeyboardArrowRight /></div>
                    <div className="size-9 border-1 flex justify-center items-center rounded-sm hover:bg-footer hover:text-white hover:border-0" onClick={() => pageNo < totalPages && setPageNo(totalPages)}><MdOutlineKeyboardDoubleArrowRight /></div>
                </div>
            </div>
    </div>
    )
}

export default Popular