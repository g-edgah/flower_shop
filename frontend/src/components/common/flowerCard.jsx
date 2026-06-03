import { ImHeart } from "react-icons/im";
import { IoIosBasket } from "react-icons/io";

import { useEditWishlist, useAddCart } from "../../hooks/user";

const FlowerCard = ({id, name, type, price, image, liked, carted, userRefetch}) => {

    
    // api call
    const { mutate: editWishlist, isLoading: wishlistLoading, error: wishlistError } = useEditWishlist();
    const { mutate: addCart, isLoading: cartLoading, error: cartError } = useAddCart();
    
        

    const handleWishlistToggle = (productId) => {
        console.log("product to wishlist id: ", id)
        editWishlist({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower"
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    userRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                   
                }
            })
    };

    const handleCartToggle = () => {
        console.log("product to wishlist id: ", id)
        addCart({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower",
            quantity: 1
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    userRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                   
                }
            })
    };

    return (
        <div className="relative group h-73 md:h-91 w-42 min-w-42 md:w-55 md:min-w-45 bg-cartCard rounded-lg flex flex-col space-y-2 md:space-y-3">
            <ImHeart onClick={handleWishlistToggle} className={` absolute top-2 right-3   cursor-pointer size-6 ${liked ? 'text-summaryButtons block hover:text-gray-500' : 'text-gray-500 hidden group-hover:block hover:text-summaryButtons'}`} />
            <img className='w-full h-73 rounded-lg' src={`/${image}`} alt="flowers" />

            <div className="flex justify-between pl-4 pr-3 items-center">
                <div className="flex flex-col space-y-3">
                    <span className="text-sm md:text-md font-semibold name">{name}</span>
                    <span className="price text-sm md:text-md font-semibold ">ksh {price}</span>
                </div>
                <button onClick={handleCartToggle} className={`absolute top-47 left-33 md:static bg-gray-300 hover:text-white hover:bg-summaryButtons md:size-10 rounded-lg flex items-center justify-around ${carted ? 'text-white bg-summaryButtons' : 'bg-gray-300'}`}>
                    <IoIosBasket className="size-7 md:size-7" />
                </button>
            </div>
            

        </div>
    )
}

export default FlowerCard;