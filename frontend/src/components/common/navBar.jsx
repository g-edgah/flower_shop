import { Link, useNavigate } from 'react-router-dom';
import { PiFlowerLotusLight } from "react-icons/pi";
import { HiUser } from "react-icons/hi2";
import { ImSearch } from "react-icons/im";
import { HiMiniXMark } from "react-icons/hi2";
import { IoIosBasket } from "react-icons/io";
import { BiMenu } from "react-icons/bi";
import { useState } from 'react';

import SearchBar from './searchBar';
import NavDrawer from './navDrawer';    

const NavBar = ({page, setPage }) => {
    const navigate = useNavigate();
    const [isSearch, setIsSearch] = useState(false);
    const [isSearchBar, setIsSearchBar] = useState(false);
    const [navDrawerOpen, setIsNavDrawerOpen] = useState(false);

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

    const handleNavDrawer = (value) => {
        if (value === 0) {
            setIsNavDrawerOpen(false);
            console.log(value, navDrawerOpen)
            return
        } else if (value === 1) {
            setIsNavDrawerOpen(!navDrawerOpen)
            console.log(value, navDrawerOpen)
        }
    }

    
    return (
        <>
            <div className={`nav w-screen flex flex-col justify-around items-center pt-2 pb-1 md:pt-3 bg-gray-200 relative transition-all duration-300 ease-in-out ${isSearch ? 'transition h-32 md:h-30' : 'h-23 md:h-23'}`} >
                <div className="flex items-center justify-between pl-2 pr-5.5 xs:pr-7 xs:pl-4 md:px-10 lg:px-25 w-full md:w-full absolute top-2 md:top-7 h-10">
                    {/* left */}
                    <div className='flex items-center space-x-4 '>
                        <button onClick={()=> handleNavDrawer(1)} className='hidden'>
                             <BiMenu className="h-6 w-6 text-navText"/>
                            
                                
                        </button>

                       
                            <NavDrawer navDrawerOpen={navDrawerOpen} handleNavDrawer={handleNavDrawer} />
                        

                        <Link onClick={()=>{
                            setPage('home')}} to='/' className={`bg-none text-2xl font-medium flex items-center space-x-0.5 text-navHover`}>
                            <PiFlowerLotusLight className=''/>
                            <span className=" mb-1"> uaridi</span>
                        </Link>
                    </div>

                    {/* center */}
                    {/* {(!isSearch) ? (<div className={`hidden space-x-6 font-medium text-[15px] ${isSearchBar ? '' : 'md:flex'}`}>
                        <Link className="text-700 hover:text-navHover" >bouquets</Link>
                        <Link className="text-700 hover:text-navHover" >flowers</Link>
                        <Link className="text-700 hover:text-navHover" >occassions</Link>
                        <Link className="text-700 hover:text-navHover" >colors</Link>
                        <Link className="text-700 hover:text-navHover" >popular</Link>
                    </div>) : ( */}
                    {(isSearch) && (
                        <div className="hidden md:flex justify-center w-300">
                            <SearchBar isSearchBar={isSearchBar} handleSearchToggle={handleSearchToggle} isSearch={isSearch} setIsSearch={setIsSearch}/>
                        </div>
                    )}
                    

                    {/* right */}
                    <div className="flex items-center space-x-4">
                        <div className={` ${isSearch ? 'hidden md:flex text-active hover:text-navText' : 'flex text-navText hover:text-active'}`}>
                            {isSearch ? (
                                <button onClick={()=> handleSearchToggle()}>
                                    <HiMiniXMark className="h-6 w-6"/>
                                </button>
                            ) : (
                                <button onClick={()=> handleSearchToggle()}>
                                    <ImSearch className="h-5 w-5"/>
                                </button>
                            )}
                        </div>
                        <Link to='/profile' className="text-navText hover:text-navHover">
                            <HiUser className="h-6 w-6"/>
                        </Link>
                        <button onClick={() => navigate('/cart')} className="relative cursor-pointer text-navText hover:text-navHover">
                            <IoIosBasket className="h-6 w-6"/>
                            <span className="absolute -top-1 bg-topbar text-white text-xs rounded-full px-2 py-0.5">0</span>
                            
                        </button >
                        
                    </div>  
                </div>
                <div className={`${isSearch ? 'flex md:hidden justify-center mt-2 absolute top-10 md:top-2/4 w-full' : 'hidden'}`}>
                    <SearchBar isSearchBar={isSearchBar} handleSearchToggle={handleSearchToggle} isSearch={isSearch} setIsSearch={setIsSearch}/>
                </div>
                    
                

                <div className={`flex justify-around px-1  xs:space-x-6 xs:items-center xs:justify-center absolute w-full md:w-110 text-sm font-medium md:text-[16px] transition-all duration-300 ease-in-out ${isSearch ? 'flex bottom-3 md:pr-4 md:flex duration-0' : 'bottom-3 md:bottom-8 md:pr-4 '}`} >
                        <Link onClick={()=>{
                            setPage('home')}} to='/' className={`text-700 hover:text-navHover ${page == 'home' ? 'text-navHover':'text-navText'}`} >home</Link>
                        <Link onClick={()=>{
                            setPage('bouquets')}} to='/bouquets' className={`text-700 hover:text-navHover ${page == 'bouquets' ? 'text-navHover':'text-navText'}`} >bouquets</Link>
                        <Link onClick={()=>{
                            setPage('flowers')}} to='/flowers' className={`text-700 hover:text-navHover ${page == 'flowers' ? 'text-navHover':'text-navText'}`} >flowers</Link>
                       
                        {/* <Link onClick={()=>{
                            setPage('colors')}} to='/colors' className={`text-700 hover:text-navHover ${page == 'colors' ? 'text-navHover':'text-navText'}`} >colors</Link> */}
                        <Link onClick={()=>{
                            setPage('popular')}} to='/popular' className={`text-700 hover:text-navHover ${page == 'popular' ? 'text-navHover':'text-navText'}`} >popular</Link>
                         <Link onClick={()=>{
                            setPage('design')}} to='/design' className={`text-700 hover:text-navHover ${page == 'design' ? 'text-navHover':'text-navText'}`} >design</Link>
                    </div>
            </div>
        
        </>
    )
}

export default NavBar