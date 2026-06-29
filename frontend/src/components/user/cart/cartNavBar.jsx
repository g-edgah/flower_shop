import { Link, useNavigate } from 'react-router-dom';
import { PiFlowerLotusLight } from "react-icons/pi";
import { HiUser } from "react-icons/hi2";
import { ImSearch } from "react-icons/im";
import { HiMiniXMark } from "react-icons/hi2";
import { IoIosBasket } from "react-icons/io";
import { BiMenu } from "react-icons/bi";
import { useState } from 'react';

import CartSearchBar from './cartSearchBar';

const CartNavBar = () => {
    const navigate = useNavigate();
    const [isSearch, setIsSearch] = useState(false);
    const [isSearchBar, setIsSearchBar] = useState(false);

    const handleSearchToggle = () => {
        setIsSearch(!isSearch);
        if (isSearch) {
            setTimeout(() => {
                setIsSearchBar(false);
            }, 300);
        } else {
            setTimeout(() => {
                setIsSearchBar(true);
            }, 300);
        }
    }  

    
    return (
        <>
            <div className={`nav w-screen flex flex-col justify-around pt-2 pb-1 md:pt-3 bg-nav relative transition-all duration-300 ease-in-out ${isSearch ? 'h-27 md:h-23' : 'h-15 md:h-23'}`} >
                <div className={`flex items-center justify-between pl-2 pr-5.5 xs:pr-7 xs:pl-4 md:px-10 lg:px-25 w-full md:w-full absolute top-2 md:top-7 h-10 ${isSearch ? '' : ''}`}>
                    {/* left */}
                    <div className='flex items-center space-x-4 '>
                        <button className='hidden'>
                                <BiMenu className="h-6 w-6 text-navText"/>
                        </button>

                        <Link to='/' className="text-2xl font-medium flex items-center space-x-0.5 hover:text-navHover">
                            <PiFlowerLotusLight />
                            <span className="mb-1"> uaridi</span>
                        </Link>
                    </div>

                    {/* center */}
                    {(isSearch) && (
                        <div className="hidden md:flex justify-center w-300">
                            <CartSearchBar isSearchBar={isSearchBar} handleSearchToggle={handleSearchToggle} isSearch={isSearch}/>
                        </div>
                    )}
                    

                    {/* right */}
                    <div className="flex items-center space-x-4">
                        <div className={`hover:text-navHover ${isSearch ? 'hidden md:flex' : 'flex'}`}>
                            {isSearch ? (
                                <button onClick={()=> handleSearchToggle()}>
                                    <HiMiniXMark className="text-active hover:text-navText h-6 w-6"/>
                                </button>
                            ) : (
                                <button onClick={()=> handleSearchToggle()}>
                                    <ImSearch className="text-navText hover:text-navHover w-5 h-5"/>
                                </button>
                            )}
                        </div>
                        <Link to='/profile' className="text-navText hover:text-navHover">
                            <HiUser className="h-6 w-6 "/>
                        </Link>
                        <button onClick={() => navigate('/cart')} className="relative cursor-pointer text-active ">
                            <IoIosBasket className="h-6 w-6 text-nav-text"/>
                            <span className="absolute -top-1 bg-navHover text-white text-xs rounded-full px-2 py-0.5">0</span>
                            
                        </button >
                        
                    </div>  
                </div>
                <div className={`${isSearch ? 'flex md:hidden justify-center mt-2 absolute bottom-3 md:top-2/4 w-full' : 'hidden'}`}>
                    <CartSearchBar isSearchBar={isSearchBar} handleSearchToggle={handleSearchToggle} isSearch={isSearch}/>
                </div>
                
            </div>
        
        </>
    )
}

export default CartNavBar