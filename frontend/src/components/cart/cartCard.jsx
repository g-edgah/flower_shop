import { FaRegTrashCan } from "react-icons/fa6";

import { useAddCart, useMinusCart, useDeleteCart } from "../../hooks/user";


const CartCard = ({id, name, type, price, quantity, image, userRefetch, cartRefetch}) => {  
    const productPrice = price * quantity;

    // api call
    const { mutate: minusCart, isLoading: wishlistLoading, error: minusCartError } = useMinusCart();
    const { mutate: addCart, isLoading: cartLoading, error: addCartError } = useAddCart();
    const { mutate: deleteCart, isLoading: deleteCartLoading, error: deleteCartError } = useDeleteCart();
        
            
    
    const deleteCartToggle = () => {
        deleteCart({
            productId: id
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    userRefetch()
                    cartRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                    
                }
            })
    };
    
        
    const addCartToggle = () => {
        addCart({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower",
            quantity: 1
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    cartRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                    
                }
            })
    };


    const minusCartToggle = () => {
        minusCart({
            productId: id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower",
            quantity: 1
        }, 
        {
            onSuccess: (data) => {
                console.log('Edit successfull!', data)
                cartRefetch()
                
            },
            onError: (error) => {
                console.error('Edit failed: ', error)
                alert('Edit failed. Please try again.')
                
            }
        })
    };


    

    return (
        <div className="container min-w-full h-35 justify-between md:h-40 bg-cartCard text-cartCardText rounded-md flex">

            <div className="image h-full aspect-[1/1.1]">
                <img className="rounded-md h-full" src={`/${image}`} alt="product image" />
            </div>

            <div className="details flex justify-around grow text-md md:text-md items-center">

                <div className="name text-[16px] font-semibold md:font-semibold">
                    <span>{name}</span>
                </div>

                <div className="price mb-2 md:mb-0">
                    <span>ksh</span> <span className="font-bold"> {price}</span>
                </div>

                <div className="quantity mt-5 mb-5  md:mb-3 md:mt-3 flex items-center justify-center w-40 flex-row gap-6">
                    <button onClick={() => {deleteCartToggle()}} className="text-red-900 cursor-pointer">
                        <FaRegTrashCan className="h-5 w-5"/>
                    </button>

                    <button onClick={() => {minusCartToggle()}} className="text-lg w-6 h-6 text-cartCardButtonsText bg-cartCardButtons pb-0.5 rounded-md flex justify-around items-center cursor-pointer"> -
                    </button>
                    
                    <div className="p-x-3 flex items-center">
                        <span className="text-center">{quantity}</span>
                    </div>

                    <button onClick={() => {addCartToggle()}} className="text-lg w-6 h-6 bg-cartCardButtons text-cartCardButtonsText hover:bg-cartCardButtonsHover pb-0.5 rounded-md flex justify-around items-center cursor-pointer">+
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