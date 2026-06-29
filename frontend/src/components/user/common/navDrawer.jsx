import { HiMiniXMark } from "react-icons/hi2";
import { useEffect, useRef } from 'react';

const NavDrawer = ({navDrawerOpen, handleNavDrawer}) =>{
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const contRef = useRef(null);

    useEffect(() => {
    const handleClickOutside = (event) => {
      //if click is NOT inside menu AND NOT on button, close menu
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target) &&
        //only when the transparent container is clicked i.e the drawer is out to prevent every click event from calling the handleNavDrawer function
        contRef.current &&
        contRef.current.contains(event.target)
      ) {
        handleNavDrawer(0);
      }
    };

        //event listener
        document.addEventListener('mousedown', handleClickOutside);
        
        //cleanup
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navDrawerOpen]);

    return (
      // this first div covers the ntire screen but stays transparent so that when a user clicks outside the menu the menu closes without clicking what's underneath the useEffect then handles closing the menu
      <div ref={contRef} className={`fixed top-9 z-19 left-0 w-screen h-screen bg-none transform transition-transform duration-500 ${navDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`} >
        <div ref={menuRef} className={`drawer z-20 absolute top-0 h-130 w-70 bg-gray-400 rounded-r-lg  `}>
            <button ref={buttonRef} onClick={() => handleNavDrawer(0)} className="closeDrawer absolute top-4 left-2">
                < HiMiniXMark className="h-6 w-6"/>
            </button>
           
        </div>
      </div>
    )
}

export default NavDrawer;