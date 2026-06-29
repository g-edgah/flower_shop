import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useMediaQuery } from 'react-responsive';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const DiscountSlider = () => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    
    const discounts = [
        {
            id: 1,
            bgImage: "/src/assets/discount/discount-7.jpeg",
            content: (
                <>
                    <span className="text-lg">get <span className="font-bold">20% OFF</span> on your first bouquet</span>
                </>
            )
        },
        {
            id: 2,
            bgImage: "/src/assets/discount/discount-1.jpeg",
            content: (
                <>
                    <span className="text-lg">save <span className="font-bold">ksh 5</span> per tulip</span>
                    <span className="">was 
                        <span className="line-through decoration-2 font-bold"> ksh 30</span>
                    </span>
                    <span className="">
                        now
                        <span className="font-bold"> ksh 25</span>
                    </span>
                </>
            )
        }
    ];
    
    if (isMobile) {
        return (
            <div className="w-[90vw] mx-auto">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    navigation={false}
                    style={{
                        "--swiper-pagination-color": "#0F172B",        // active dot color
                        "--swiper-pagination-bullet-inactive-color": "#999999",  // inactive dots color
                        "--swiper-pagination-bullet-size": "8px",      // dot size
                        "--swiper-pagination-bullet-horizontal-gap": "8px",  // space between dots
                        "--swiper-pagination-bottom": "3px",        // distance from bottom
                    }}
                    loop={true}
                    className="rounded-xl overflow-hidden"
                >
                    {discounts.map((discount) => (
                        <SwiperSlide key={discount.id}>
                            <div 
                                className="h-64 rounded-xl bg-center bg-cover bg-no-repeat flex justify-center flex-col space-y-1 pl-10"
                                style={{ backgroundImage: `url(${discount.bgImage})` }}
                            >
                                {discount.content}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        );
    }
    
    // Desktop view - side by side
    return (
        <div className="w-full max-w-244 mx-auto px-4">
            <div className="flex space-x-5">
                {discounts.map((discount) => (
                    <div
                        key={discount.id}
                        className="w-1/2 h-60 rounded-xl bg-center bg-cover bg-no-repeat flex justify-center flex-col space-y-1 pl-10 transition-all duration-500"
                        style={{ backgroundImage: `url(${discount.bgImage})` }}
                    >
                        {discount.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscountSlider;