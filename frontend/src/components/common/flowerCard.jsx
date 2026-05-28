import { ImHeart } from "react-icons/im";
import { IoIosBasket } from "react-icons/io";

const FlowerCard = ({name, price, image, liked, carted}) => {
    return (
        <div className="relative group h-73 md:h-91 w-42 min-w-42 md:w-55 md:min-w-45 bg-cartCard rounded-lg flex flex-col space-y-2 md:space-y-3">
            <ImHeart className={`hidden group-hover:block absolute top-2 right-2  hover:text-summaryButtons cursor-pointer size-7 ${liked ? 'text-summaryButtons' : 'text-gray-500'}`} />
            <img className='w-full  rounded-lg' src={`/${image}`} alt="flowers" />

            <div className="flex justify-between px-4 items-center">
                <div className="flex flex-col space-y-3">
                    <span className="text-sm md:text-md font-semibold name">{name}</span>
                    <span className="price text-sm md:text-md font-semibold ">ksh {price}</span>
                </div>
                <button className={`absolute top-47 left-33 md:static  bg-gray-300 hover:text-white hover:bg-summaryButtons md:size-10 rounded-lg flex items-center justify-around ${carted ? 'text-white bg-summaryButtons' : 'bg-gray-300'}`}>
                    <IoIosBasket className="size-7 md:size-7" />
                </button>
            </div>
            

        </div>
    )
}

export default FlowerCard;