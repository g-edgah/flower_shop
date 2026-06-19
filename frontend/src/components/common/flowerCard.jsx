import { ImHeart } from "react-icons/im";
import { IoIosBasket } from "react-icons/io";

import { useEditWishlist, useAddCart } from "../../hooks/user";

const FlowerCard = ({item, liked, carted, userRefetch, handleAddToCart, handleWishlistToggle, cartRefetch }) => {

    

    return (
        <div className="relative group h-73 md:h-91 w-42 min-w-42 md:w-55 md:min-w-45 bg-cartCard rounded-lg flex flex-col space-y-2 md:space-y-3">
            <ImHeart onClick={() => handleWishlistToggle(item)} className={` absolute top-2 right-3   cursor-pointer size-6 ${liked ? 'text-summaryButtons block hover:text-gray-500' : 'text-gray-500 hidden group-hover:block hover:text-summaryButtons'}`} />
            <img className='w-full h-73 rounded-lg' src={`/${item.picturePath}`} alt="flowers" />

            <div className="flex justify-between pl-4 pr-3 items-center">
                <div className="flex flex-col space-y-3">
                    <span className="text-sm md:text-md font-semibold name">{item.name}</span>
                    <span className="price text-sm md:text-md font-semibold ">ksh {item.price}</span>
                </div>
                <button onClick={() => handleAddToCart(item)} className={`absolute top-47 left-33 md:static bg-gray-300 hover:text-white hover:bg-summaryButtons md:size-10 rounded-lg flex items-center justify-around ${carted ? 'text-white bg-summaryButtons' : 'bg-gray-300'}`}>
                    <IoIosBasket className="size-7 md:size-7" />
                </button>
            </div>
            

        </div>
    )
}

export default FlowerCard;