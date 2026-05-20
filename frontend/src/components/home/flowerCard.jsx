import { IoIosBasket } from "react-icons/io";

const FlowerCard = ({name, price, image}) => {
    return (
        <div className="relative h-73 md:h-91 w-42 min-w-42 md:w-55 md:min-w-45 bg-cartCard rounded-lg flex flex-col space-y-2 md:space-y-3">
            <img className='w-full  rounded-lg' src={`/${image}`} alt="flowers" />
            <div className="flex justify-between px-4 items-center">
                <div className="flex flex-col space-y-3">
                    <span className="text-sm md:text-md font-semibold name">{name}</span>
                    <span className="price text-sm md:text-md font-semibold ">ksh {price}</span>
                </div>
                <button className="absolute top-47 left-33 md:static  bg-gray-300 hover:text-white hover:bg-summaryButtons md:size-10 rounded-lg flex items-center justify-around">
                    <IoIosBasket className="size-7 md:size-7" />
                </button>
            </div>
            

        </div>
    )
}

export default FlowerCard;