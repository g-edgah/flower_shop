import { IoIosBasket } from "react-icons/io";
import { ImHeartBroken } from "react-icons/im";

import { useEditWishlist, useAddCart } from "../../hooks/user";

const WishlistCard = ({ item, wishlistRefetch, userRefetch }) => {
    //console.log("order: ", order)
    const { _id, name, description, inStock, price, type, picturePath } = item;
    console.log("wishlist item: ", item)

    const { mutate: editWishlist, isLoading: wishlistLoading, error: wishlistError } = useEditWishlist();
    const { mutate: addCart, isLoading: cartLoading, error: cartError } = useAddCart();

    const handleWishlistToggle = () => {
        console.log("product to wishlist id: ", _id)
        editWishlist({
            productId: _id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower"
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    wishlistRefetch()
                    userRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                   
                }
            })
    };

    const handleCartToggle = () => {
        console.log("product to wishlist id: ", _id)
        addCart({
            productId: _id,
            productModel: type === "bouquet" ? "Bouquet" : "Flower",
            quantity: 1
        }, {
                onSuccess: (data) => {
                    console.log('Edit successfull!', data)
                    wishlistRefetch()
                    userRefetch()
                    
                },
                onError: (error) => {
                    console.error('Edit failed: ', error)
                    alert('Edit failed. Please try again.')
                   
                }
            })
    };

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
                <button onClick={handleWishlistToggle}  className="remove flex items-center gap-1 border-[1.5px] h-10 px-1 rounded-md cursor-pointer">
                    <span  className="detail " onClick={() => handlzxeOrderDetails(order, "details")}>remove</span>
                    <ImHeartBroken className="size-4"/>
                </button>

                <button onClick={handleCartToggle} className="addcart flex items-center gap-1 border-[1.5px] h-10 px-1 rounded-md text-summaryButtons cursor-pointer ">
                    <span  className="detail " onClick={() => handlzxeOrderDetails(order, "details")}>{inStock ? 'add to cart' : 'out of stock' }</span>
                    <IoIosBasket className="size-5"/>
                </button>
                
            </div>
        </div>
    );
};

export default WishlistCard;