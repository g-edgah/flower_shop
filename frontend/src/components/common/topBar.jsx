import { TbBrandMeta } from 'react-icons/tb';
import  { IoLogoInstagram } from 'react-icons/io5';
import  { RiTwitterXLine } from 'react-icons/ri';

const TopBar = () => {
    return (
        <div className='w-screen flex justify-around bg-topbar text-white'>
            <div className='flex items-center justify-between py-2 pl-2 pr-5.5 xs:pr-7 xs:pl-4 md:px-10 lg:px-25 w-full md:w-full'>
                <div className='hidden md:flex items-center space-x-4'>
                    <a href="#" className='hover:text-gray-300'>
                        <TbBrandMeta className='h-5 w-5'/>
                    </a>
                    <a href="#" className='hover:text-gray-300'>
                        <IoLogoInstagram className='h-5 w-5'/>
                    </a>
                    <a href="#" className='hover:text-gray-300'>
                        <RiTwitterXLine className='h-5 w-5'/>
                    </a>
                </div>
                <div className="text-sm text-center grow">
                    <span>We deliver country wide fast and reliably!</span>
                </div>
                <div className="text-sm hidden md:block">
                    <a href="tel:+00012345678" className='hover:text-gray-300'>
                        +0 (000) 123-456
                    </a>
                </div>
            </div>
        </div>
    )
}

export default TopBar