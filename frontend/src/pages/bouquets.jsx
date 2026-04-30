import { useEffect, useState } from "react"

import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import SideBar from '../components/common/boquetSideBar.jsx'
import FlowerCard from '../components/home/flowerCard.jsx'
import Filter from '../components/common/filter.jsx'

const Bouquets = ({setPage}) => {
    const [pageNo, setPageNo] = useState(1)
    const [sortOpen, setSortOpen] = useState(false)
    const [sortBy, setSortBy] = useState('newest')

    const toggleSort = () => {
        setSortOpen(!sortOpen)
    }

    const handleSort = (option) => {
        setSortBy(option)
        setSortOpen(false)
    }

    useEffect(() => {
        //ensures page is set to bouquets when navigation is through other channels apart from button clicking such as navigating back 
        setPage("bouquets")
    }, [])
    
    return (
        <div className="flex justify-center">
            <SideBar />
            <div className="boquets flex flex-col space-y-5 items-center max-w-250 pb-10">
                <Filter handleSort={handleSort} toggleSort={toggleSort} sortOpen={sortOpen} sortBy={sortBy} />
                <div className="flower-row pb-10 flex gap-5 w-full  flex-wrap justify-center items-center max-w-300">
                
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

export default Bouquets