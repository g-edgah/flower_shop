import { IoIosBasket } from "react-icons/io";
import { ImHeartBroken } from "react-icons/im";

import { useEditWishlist, useAddCart } from "../../hooks/user";

const WishlistCard = ({ item, handleAddToCart, handleWishlistToggle, carted }) => {
    //console.log("order: ", order)
    const { _id, name, description, inStock, price, type, picturePath } = item;
    console.log("wishlist item: ", item)


    return (
        <div className="order-card bg-gray-200 p-3 border-[1.5px] border-gray-400 rounded-md flex gap-2 justify-between">
            <div className="order-info flex gap-5">
                <div className="img size-32">
                    <img
                        src={`/${picturePath}`}
                        alt={`${name}`}
                        className="rounded-md w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = '/default-product.png';
                        }}
                    />
                </div>
                <div className="info flex flex-col gap-1 justify-between text-[15px] text-gray-800">

                    <span className="name font-semibold text-lg text-black">{name}</span>
                    <span>{inStock ? 'in stock' : 'out of stock' }</span>
                    <span>price: {price}</span>
                    
                    
                </div>
            </div>
            <div className="details flex gap-2 items-end">
                <button onClick={() => handleWishlistToggle(_id, type)}  className="remove flex items-center gap-1 border-[1.5px] h-10 px-2 rounded-md cursor-pointer text-gray-700 hover:text-black">
                    <span  className="detail ">remove</span>
                    <ImHeartBroken className="size-4"/>
                </button>

                <button 
                
                    onClick={() => {

                        if (inStock){
                            handleAddToCart(_id, type)
                        } 
                    }}

                    className={`addcart flex items-center gap-1 h-10 px-2 rounded-md text-white ${ carted ? 'bg-summaryButtons hover:bg-gray-400' : 'bg-gray-500 hover:bg-summaryButtons'} font-[450] cursor-pointer `}
                >
                    <span  className="detail " >
                        {inStock && !carted && 'add to cart' }
                        {inStock && carted && 'in cart'}
                        {!inStock && 'out of stock' }
                    </span>
                    <IoIosBasket className="size-5"/>
                </button>
                
            </div>
        </div>
    );
};

export default WishlistCard;