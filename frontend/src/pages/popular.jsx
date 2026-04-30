import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import FlowerCard from '../components/home/flowerCard.jsx'


const Popular = ({ setPage }) => {
    const [pageNo, setPageNo] = useState(1)

    useEffect(() => {
        //ensures page is set to popular when navigation is through other channels apart from button clicking such as navigating back 
        setPage("popular")
    }, [])

    return (
        <div className='flex justify-center'>
            <div className="boquets flex flex-col space-y-5 items-center max-w-250 pb-10">
                <div className="flower-row py-10 flex gap-5 w-full  flex-wrap justify-center items-center max-w-300">
                
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    
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