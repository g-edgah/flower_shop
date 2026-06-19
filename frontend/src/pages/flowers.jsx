import { useEffect, useState } from "react"

import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import SideBar from '../components/flowers/flowerSideBar.jsx'
import FlowerCard from '../components/common/flowerCard.jsx'
import Filter from '../components/common/filter.jsx'

import { useFlowers } from '../hooks/products.js';
import { use } from "react";

const Flowers = ({ setPage, handleAddToCart, handleWishlistToggle, cart, wishlist }) => {
    const [pageNo, setPageNo] = useState(1);
    const [sortOpen, setSortOpen] = useState(false);
    const [sortBy, setSortBy] = useState('popularity')

    const [colors, setColors] = useState(['all']);  
    const [occasion, setOccasions] = useState('all');
    const [inputMin, setInputMin] = useState(0);
    const [inputMax, setInputMax] = useState(99999);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 99999 });

    const [filters, setFilters] = useState({
        occasion: 'all',
        colors: ['all'],
        priceRange: { min: 0, max: 99999 },
        sortBy: 'popularity',
        pageNo: 1
    });

    useEffect(() => {
        setFilters({
            occasion,
            colors,
            priceRange,
            sortBy,
            pageNo
        })
    }, [occasion, colors, priceRange, sortBy, pageNo])


    const toggleSort = () => {
        setSortOpen(!sortOpen)
    }

    const handleSort = (option) => {
        setSortBy(option)
        setSortOpen(false)
    }

    const toggleColor = (newColor) => {
        if(newColor === 'all'){
            setColors(['all'])
            return
        }



        if(colors.includes(newColor) && colors.length > 1){
            setColors(colors.filter(c => c !== newColor))

        } else if(!colors.includes(newColor) && colors.length === 6) {
            setColors(['all'])

        }else if(!colors.includes(newColor)){
            setColors([...colors, newColor])
            if(colors.includes('all')){
                setColors([newColor])

            }
        }

        console.log(colors)
    }   

    const handlePriceRange = () => {
        setPriceRange({ min: inputMin, max: inputMax });
    }

    useEffect(() => {
        //ensures page is set to bouquets when navigation is through other channels apart from button clicking such as navigating back 
        setPage("flowers")
    }, [])

    
    const { data, isLoading, error, isFetching, refetch } = useFlowers(filters);

    //const { banners, categories, floristPicks, popularProducts, newProducts, featuredBouquets, featuredFlowers, stats } = data;

    //console.log(data)
    
   
    
    return (
        <div className="flex justify-center">
            <SideBar colors={colors} toggleColors={toggleColor} occasion={occasion} setOccasions={setOccasions} inputMin={inputMin} inputMax={inputMax} setInputMax={setInputMax} setInputMin={setInputMin} handlePriceRange={handlePriceRange}/>
            <div className="bo uquets flex flex-col space-y-5 items-center max-w-250 pb-10">
                <Filter handleSort={handleSort} toggleSort={toggleSort} sortOpen={sortOpen} sortBy={sortBy} />
                
                {isLoading && (
                    <div>Loading first time...</div>
                )}

                { error && (
                    <div>Error: {error.message}</div>
                )}


                {data && (
                <div className="flower-row pb-10 flex gap-5 w-full  flex-wrap justify-center items-center max-w-300">
                
                    {data.products.map((item, index) => {
                        const liked = wishlist?.some(wishlistItem => wishlistItem?._id?.toString() === item?._id?.toString()) || false;
                        const carted = cart?.some(cartItem => cartItem?._id?.toString() === item?._id?.toString()) || false;
                        
                        return (
                            
                            <FlowerCard
                            item={item}
                            liked={liked}
                            carted={carted}
                            handleAddToCart={handleAddToCart}
                            handleWishlistToggle={handleWishlistToggle}
                            />
                    )})}
                    
                </div>
                )}
                <div className="pages flex gap-1">
                    <div className="size-9 border-1 flex justify-center items-center rounded-sm hover:bg-active hover:text-white hover:border-0" onClick={() => setPageNo(1)}><MdOutlineKeyboardDoubleArrowLeft /></div>
                    <div className="size-9 border-1 flex justify-center items-center rounded-sm hover:bg-active hover:text-white hover:border-0" onClick={() => pageNo > 1 && setPageNo(pageNo - 1)}><MdKeyboardArrowLeft /></div>
                    <div className="size-9 flex justify-center items-center rounded-sm text-white font-bold bg-active">{pageNo}</div>
                    <div className="size-9 border-1 flex justify-center items-center rounded-sm hover:bg-active hover:text-white hover:border-0" onClick={() => setPageNo(pageNo + 1)}><MdKeyboardArrowRight /></div>
                    <div className="size-9 border-1 flex justify-center items-center rounded-sm hover:bg-active hover:text-white hover:border-0" onClick={() => pageNo < totalPages && setPageNo(totalPages)}><MdOutlineKeyboardDoubleArrowRight /></div>
                </div>
            </div>
            
        </div>
    )
}

export default Flowers