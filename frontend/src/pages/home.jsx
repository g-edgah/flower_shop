import FlowerCard from '../components/home/flowerCard.jsx'
import OccassionCard from '../components/home/occassionCard.jsx'
import DiscountCard from '../components/home/discountCard.jsx'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useRef, useState, useEffect } from 'react';

const HomePage = ({setPage}) => {
    const sliderRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [showFirst, setShowFirst] = useState(true);

    const checkScroll = () => {
        if (!sliderRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scroll = (direction) => {
        if (!sliderRef.current) return;
        
        const scrollAmount = sliderRef.current.clientWidth;
        sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
        });
        
        // Check arrows after scroll
        setTimeout(checkScroll, 300);
    };

    useEffect(() => {
        //ensures page is set to home when navigation is through other channels apart from button clicking such as navigating back 
        setPage("home")

        const interval = setInterval(() => {
            setShowFirst(prev => !prev);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col space-y-10 md:space-y-15">

            <div className="bg-[url(/src/assets/bouquets/image_copy_5.png)] bg-cover bg-center bg-no-repeat w-full h-80 md:h-170 flex items-center">
                <div className="absolute left-5 md:left-10 flex flex-col space-y-3 md:space-y-5 w-70 md:w-130">
                    <span className='font-bold text-lg md:text-4xl'>design your own bouquet!</span>
                    <span className='text-sm'>customize everything from the flower types and colors to even wrapper for your bunch</span>
                    <button className=' md:text-md w-30 md:w-30 bg-summaryButtons rounded-lg h-10 text-white'>get started</button>
                    
                </div>
                
            </div>

            <div className="relative flex flex-col spacing-y-4 items-center jsutify-around space-y-5">
                <span className='font-bold text-lg md:text-xl'>featured discounts</span>
               
                <div className=" discounts aspect-2/1 md:aspect-4/1 w-[90vw] flex md:space-x-5 md:px-4 relative md:w-full md:max-w-244 justify-center items-center">
                    
                    <div className={`h-full w-full md:w-[calc(50%-0.75rem)] bg-[url(/src/assets/discount/discount-7.jpeg)] bg-center bg-cover bg-no-repeat rounded-xl flex justify-center flex-col space-y-1 pl-10 z-20 absolute left-0 md:relative card1 transition-all duration-1500 ${showFirst ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                        <span className="w-50 text-lg">get <span className="font-bold">20% OFF</span> on your first bouquet</span>
                    </div>

                   <div className={`h-full md:h-60 w-full md:w-[calc(50%-0.75rem)] bg-[url(/src/assets/discount/discount-1.jpeg)] bg-center bg-cover bg-no-repeat rounded-xl flex justify-center flex-col space-y-1 pl-10 z-19 absolute md:relative left-0 card2 transition-all  duration-1500 ${!showFirst ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
                        <span className="w-50 text-lg">save <span className="font-bold">ksh 5</span> per turlip</span>
                        <span className="">was 
                            <span className="line-through decoration-2 font-bold"> ksh 30</span>
                        </span>
                        <span className="">
                            now
                            <span className="font-bold"> ksh 25</span>
                        </span>
                
                    </div>
          
                </div>
            </div>

            <div className="new flex flex-col items-center w-full space-y-5 justify-center">
                <span className='font-bold text-lg md:text-xl'>new arrivals</span>
                <div className="flex space-x-5">
                    <FlowerCard name="yellow yellow" space-y-5 price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                </div>
                
            </div>

            <div className="relative flex flex-col spacing-y-4 items-center justify-around w-full px-5 md;px-15 space-y-5">
                <span className='font-bold text-lg md:text-xl'>flowers for every occassion</span>
                <div className="flex flex-row min-w-full justify-around items-center px-3">
                    <button onClick={() => scroll('left')} className='
                    z-10 
                    absolute
                    left-3
                    md:relative
                    md:left-0
                    bg-gray-300 backdrop-blur-sm
                    w-10 h-10
                    rounded-full
                    shadow-lg
                    flex items-center justify-center
                    transition-all duration-200
                    hover:bg-white hover:shadow-xl
                    hover:scale-110
                    active:scale-95
                    border border-gray-200'>
                        <FaAngleLeft className='h-7'/>
                    </button>
                    
                    <div onScroll={checkScroll} ref={sliderRef} className="occassions  flex px-0 space-x-0 w-[85vw] max-w-234 rounded-lg justify-around items-center overflow-x-auto scroll-smooth scrollbar-hide snap-x snap-mandatory">
                        <OccassionCard className=" snap-center" text="those unforgateable milestones" title="graduation" image='bg-[url(/src/assets/graduation/grad-7.jpeg)]'/>
                        <OccassionCard className="snap-center" title="weddings" text="that special day" image='bg-[url(/src/assets/wedding/wed-3.jpeg)]'/>
                        <OccassionCard className="snap-center" title="birthdays" text="the day that's all about you" image='bg-[url(/src/assets/birthday/birth-17.jpeg)]'/>
                        <OccassionCard className="snap-center" title="gifts" text="when you want to make her/him feel special" image='bg-[url(/src/assets/romantic/rom-4.png)]'/>
                    </div>

                    <button onClick={() => scroll('right')} className="
                    z-10 
                    absolute
                    right-3
                    md:relative
                    md:right-0
                    rounded-full
                    bg-gray-300 backdrop-blur-sm
                    w-10 h-10
                    shadow-lg
                    flex items-center justify-center
                    transition-all duration-200
                    hover:bg-white hover:shadow-xl
                    hover:scale-110
                    active:scale-95
                    border border-gray-200">
                        <FaAngleRight className=' h-7'/>
                    </button>
                </div>
                
                
            </div>
            
            
            <div className="popular flex flex-col space-y-5 items-center">
                <span className='font-bold text-lg md:text-xl'>flying off the shelves</span>
                <div className="flower-row flex gap-5 w-full  flex-wrap justify-center items-center max-w-280">
                
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    
                </div>
            </div>

            <div className="popular flex flex-col space-y-5 items-center">
                <span className='font-bold text-lg md:text-xl'>florists' pick</span>
                <div className="flower-row flex gap-5 w-full  flex-wrap justify-center items-center max-w-280">
                
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    <FlowerCard name="yellow yellow" price="4200" image="bouquets/image.png"/>
                    
                </div>
            </div>
            
            <div className="bulk w-full flex justify-around">
                <div className="relative w-[95vw] max-w-234 bg-light-purple h-70 md:h-140 mb-10 rounded-lg flex justify-around items-center bg-[url(/src/assets/bulk/image.png)] bg-cover bg-center bg-no-repeat">
                    <div className='flex flex-col pl-3 md:pl-5 w-4/5 text-slate-900 md:w-3/5 space-y-4 backdrop-blur-md bg-purple-200/70 border border-white/20 shadow-lg rounded-lg p-2'>
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