import { useEffect, useState } from "react"

import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowLeft, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

import SideBar from '../components/bouquets/boquetSideBar.jsx'
import FlowerCard from '../components/common/flowerCard.jsx'
import Filter from '../components/common/filter.jsx'

import { useBouquets } from '../hooks/products.js';
import { use } from "react";

const Bouquets = ({setPage, userData, isUserLoading, userError, isUserFetching, userRefetch}) => {
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
        setPage("bouquets")
    }, [])

    
    const { data, isLoading, error, isFetching, refetch } = useBouquets(filters);

    //const { banners, categories, floristPicks, popularProducts, newProducts, featuredBouquets, featuredFlowers, stats } = data;

    //console.log(data.products)

    const wishlist = userData?.formattedUser?.wishlist || [];
    const cart = userData?.formattedUser?.cart || [];
    
   
    
    return (
        <div className="relative flex flex-row justify-center items-start  min-h-screen w-full">
            <div className="sticky min-w-60 top-28 flex" >
                <SideBar colors={colors} toggleColors={toggleColor} occasion={occasion} setOccasions={setOccasions} inputMin={inputMin} inputMax={inputMax} setInputMax={setInputMax} setInputMin={setInputMin} handlePriceRange={handlePriceRange}/>
            </div>
            
            <div className="bouquets relative flex flex-col space-y-5 items-center w-full min-h-screen max-w-250 pb-10">

                <div className=" z-10 w-full items-start">
                    <Filter handleSort={handleSort} toggleSort={toggleSort} sortOpen={sortOpen} sortBy={sortBy} />
                </div>
                
                
                {isLoading && (
                    <div>Loading first time...</div>
                )}

                { error && (
                    <div>Error: {error.message}</div>
                )}


                {data && (
                <div className="flower-row pb-10 flex gap-5 w-full flex-wrap justify-start pl-3 items-center max-w-300">
                
                    {data.products.map(({ _id, name, price, picturePath }, index) => {
                        const liked = wishlist?.some(item => item?.toString() === _id?.toString()) || false;
                        const carted = cart?.some(item => item.product?.toString() === _id?.toString()) || false;
                        
                        return (
                            
                            <FlowerCard
                            key={index} 
                            name={name}
                            price={price}
                            image={picturePath}
                            liked={liked}
                            carted={carted}
                            
                            />
                    )})}
                    
                </div>
                )}
                <div className="absolute bottom-5 pages flex gap-1">
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

export default Bouquets