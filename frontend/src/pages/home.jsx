import { useRef, useState, useEffect } from 'react';
import { use } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import FlowerCard from '../components/common/flowerCard.jsx'
import OccassionCard from '../components/home/occassionCard.jsx'
import DiscountCard from '../components/home/discountCard.jsx'
import DiscountSlider from '../components/home/discount.jsx'

import { useHome } from '../hooks/products.js';
import { useUser, useCart, useWishlist, useEditWishlist } from '../hooks/user.js';




const HomePage = ({setPage, handleAddToCart, handleWishlistToggle, cart, wishlist }) => {

    const [content, setContent] = useState([
        {title: "graduation", text: "those unforgateable milestones", image: 'bg-[url(/src/assets/graduation/grad-7.jpeg)]'},
        {title: "weddings", text: "that special day", image: 'bg-[url(/src/assets/wedding/wed-3.jpeg)]'}, 
        {title: "birthdays", text: "the day that's all about you", image: 'bg-[url(/src/assets/birthday/birth-17.jpeg)]'}, 
        {title: "gifts", text: "when you want to make her/him feel special", image: 'bg-[url(/src/assets/romantic/rom-4.png)]'}
    ]); 

    //ensures page is set to home when navigation is through other channels apart from button clicking such as navigating back 
    
    useEffect(() => {

        setPage("home")
        console.log("home")

    }, []);


    const { data, isLoading, error, isFetching, refetch } = useHome();


    if (isLoading) return <div>Loading first time...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const { banners, categories, floristPicks, popularProducts, newProducts, featuredBouquets, featuredFlowers, stats } = data.data;
    console.log("home data: ",data)
    console.log("home wishlist: ", wishlist)
    console.log("home cart: ", cart)

    return (
        <div className="home w-screen flex flex-col space-y-10 md:space-y-15 ">

            <div className="bg-[url(/bouquets/image_copy_5.png)] bg-cover bg-center bg-no-repeat w-full h-80 md:h-170 flex items-center relative">
                <div className="absolute left-5 md:left-10 flex flex-col space-y-3 md:space-y-5 w-70 md:w-130">
                    <span className='font-bold text-lg md:text-4xl'>design your own bouquet!</span>
                    <span className='text-sm'>customize everything from the flower types and colors to even wrapper for your bunch</span>
                    <button className=' md:text-md w-30 md:w-30 bg-summaryButtons rounded-lg h-10 text-white'>get started</button>
                    
                </div>
                
            </div>

            <div className="flex flex-col spacing-y-4 items-center jsutify-around space-y-5">
                <span className='font-bold text-lg md:text-xl'>featured discounts</span>
               
                <DiscountSlider />
            </div>

            <div className="new flex flex-col items-center w-full space-y-5 justify-center">
                <span className='font-bold text-lg md:text-xl'>new arrivals</span>
                <div className="flex space-x-5">
                    {newProducts.map((item, index) => {
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
                
            </div>

            <div className="relative flex flex-col spacing-y-4 items-center justify-around w-full px-5 md;px-15 space-y-5">
                <span className='font-bold text-lg md:text-xl'>flowers for every occassion</span>
                
                    
                <div className="occassions flex px-0 space-x-0 max-w-234 justify-center items-center h-73 md:h-150 w-[95vw] min-w-[95vw] md:w-234 md:min-w-234">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        loop={true}                  
        speed={500}                    
        slidesPerView={'auto'}        
        centeredSlides={true}          
        spaceBetween={0}             
        autoplay={{
          delay: 5000,                 
          disableOnInteraction: false,
        }}
        navigation={false}              // adds prev/next arrows
        pagination={{ clickable: true }} // adds dots navigation
        style={{
            "--swiper-pagination-color": "#0F172B",        // Active dot color
            "--swiper-pagination-bullet-inactive-color": "#999999",  // Inactive dots color
            "--swiper-pagination-bullet-size": "8px",      // Dot size
            "--swiper-pagination-bullet-horizontal-gap": "8px",  // Space between dots
            "--swiper-pagination-bottom": "3px",        // Distance from bottom
        }}
        touchRatio={1}                 // touchMove: true
        grabCursor={false}              
        className="w-full h-full"
      >
        {content.map(({ title, text, image }, index) => (
          <SwiperSlide key={index}> 
            <OccassionCard 
              title={title}
              text={text}
              image={image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

                
                
            </div>
            
            
            <div className="popular flex flex-col space-y-5 items-center">
                <span className='font-bold text-lg md:text-xl'>flying off the shelves</span>
                <div className="flower-row flex gap-5 w-full  flex-wrap justify-center items-center max-w-280">

                    {popularProducts.map((item, index) => {
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
            </div>

            <div className="popular flex flex-col space-y-5 items-center">
                <span className='font-bold text-lg md:text-xl'>florists' picks</span>
                <div className="flower-row flex gap-5 w-full  flex-wrap justify-center items-center max-w-280">
                
                    {floristPicks.map((item, index) => {
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
            </div>
            
            <div className="bulk w-full flex justify-around">
                <div className="relative w-[95vw] max-w-234 bg-light-purple h-70 md:h-140 mb-10 rounded-lg flex justify-around items-center bg-[url(/src/assets/bulk/image.png)] bg-cover bg-center bg-no-repeat">
                    <div className='flex flex-col pl-3 md:pl-5 w-4/5 text-slate-900 md:w-3/5 space-y-4 backdrop-blur-md bg-cartCard border border-white/20 shadow-lg rounded-lg p-2'>
                        <span className='text-md md:text-2xl font-bold'>place a bulk order</span>
                        <span className='text-sm md:text-lg font-semibold'>do you have a large event or party coming up or you just want a lot of flowers? Reach out and we'll make it happen</span>
                        <span className="font-bold">learn more</span>
                    </div>
                    <div className='h-full w-full rounded-r-lg bg-[url(/src/assets/bulk/image.png)] hidden bg-cover bg-center bg-no-repeat'> </div>
                </div>
                
                
            </div>
        </div>
    )
}

export default HomePage