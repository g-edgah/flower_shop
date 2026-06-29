import { FaRegTrashCan } from "react-icons/fa6";

import { useAddCart, useMinusCart, useDeleteCart } from "../../../hooks/user/user";


const CartCard = ({ item, cartRefetch, handleAddToCart, handleMinusFromCart, handleDeleteFromCart }) => {  
    const productPrice = item.price * item.quantity;
        
    

    return (
        <div className="container min-w-full h-35 justify-between md:h-40 bg-cartCard text-cartCardText rounded-md flex">

            <div className="image h-full aspect-[1/1.1]">
                <img className="rounded-md h-full aspect-[1/1.2]" src={`/${item.picturePath}`} alt="product image" />
            </div>

            <div className="details flex justify-around grow text-md md:text-md items-center">

                <div className="name text-[16px] font-semibold md:font-semibold">
                    <span>{item.name}</span>
                </div>

                <div className="price mb-2 md:mb-0">
                    <span>ksh</span> <span className="font-bold"> {item.price}</span>
                </div>

                <div className="quantity mt-5 mb-5  md:mb-3 md:mt-3 flex items-center justify-center w-40 flex-row gap-6">
                    <button onClick={() => {handleDeleteFromCart(item)}} className="text-red-900 cursor-pointer">
                        <FaRegTrashCan className="h-5 w-5"/>
                    </button>

                    <button onClick={() => {handleMinusFromCart(item)}} className="text-lg w-6 h-6 text-cartCardButtonsText bg-cartCardButtons pb-0.5 rounded-md flex justify-around items-center cursor-pointer"> -
                    </button>
                    
                    <div className="p-x-3 flex items-center">
                        <span className="text-center">{item.quantity}</span>
                    </div>

                    <button onClick={() => {handleAddToCart(item)}} className="text-lg w-6 h-6 bg-cartCardButtons text-cartCardButtonsText hover:bg-cartCardButtonsHover pb-0.5 rounded-md flex justify-around items-center cursor-pointer">+
                    </button>
                </div>

                <div className="price mb-2 md:mb-0">
                    <span>ksh</span> <span className="font-bold"> {productPrice.toLocaleString()}</span>
                </div>
                
            </div>
        </div>
    )
}

export default CartCard