import { useState } from 'react';

import { MdArrowRight } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";

import FlowerCard from '../home/flowerCard.jsx'


const SideBar = () => {
    const [occasionsOpen, setOccasionsOpen] = useState(true);
    const [colorsOpen, setColorsOpen] = useState(false);
    const [pricerangeOpen, setPricerangeOpen] = useState(false);

    const [occasion, setOccasions] = useState('all');
    const [color, setColor] = useState('all');
    const [pricerange, setPricerange] = useState('all');

    const isOpen = (filter) => {
        if (filter === 'occassion') {
            setOccasionsOpen(!occasionsOpen)
        } else if (filter === 'colors') { 
            setColorsOpen(!colorsOpen)
        } else if (filter === 'pricerange') {
            setPricerangeOpen(!pricerangeOpen)
        }

    }
    return (
        <div className="w-60 flex flex-col gap-5  pt-5">
            <div className="occassions w-full">
                <div className="w-full pl-3 title cursor-pointer font-bold text-lg" onClick={() => isOpen('occassion')}>
                    {
                        occasionsOpen ? <MdArrowDropDown className='inline'/> : <MdArrowRight className='inline'/>
                    }
                    <span>Occassions</span>
                </div>
                <div className={`flex pl-7 flex-col list ${occasionsOpen ? 'block' : 'hidden'} text-[14px] gap-1`}>
                    <span className={`item cursor-pointer ${occasion === 'all' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('all')}>All</span>
                    <span className={`item cursor-pointer ${occasion === 'birthday' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('birthday')}>Birthday</span>
                    <span className={`item cursor-pointer ${occasion === 'bridal' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('bridal')}>Bridal</span>
                    <span className={`item cursor-pointer ${occasion === 'wedding' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('wedding')}>Wedding</span>
                    <span className={`item cursor-pointer ${occasion === 'anniversary' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('anniversary')}>Anniversary</span>
                    <span className={`item cursor-pointer ${occasion === 'baby-shower' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('baby-shower')}>Baby Shower</span>
                    <span className={`item cursor-pointer ${occasion === 'apology' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('apology')}>Apology</span>
                    <span className={`item cursor-pointer ${occasion === 'funeral' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('funeral')}>Funeral</span>

                </div>
            </div>

            <div className={`list cursor-pointer`}>
                <div className={`w-full pl-3 title cursor-pointer font-bold text-lg`} onClick={() => isOpen('colors')}>
                    {
                        colorsOpen ? <MdArrowDropDown className='inline'/> : <MdArrowRight className='inline'/>
                    }
                    <span>Colors</span>
                </div>
                <div className={`list pl-7 flex flex-col ${colorsOpen ? 'block' : 'hidden'} text-[14px] gap-1`}>
                    <span className={`item cursor-pointer ${occasion === 'all' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('all')}>All</span>
                    <span className={`item cursor-pointer ${color === 'red' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setColor('red')}>Red</span>
                    <span className={`item cursor-pointer ${color === 'Pink' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setColor('Pink')}>Pink</span>
                    <span className={`item cursor-pointer ${color === 'blue' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setColor('blue')}>Blue</span>
                    <span className={`item cursor-pointer ${color === 'white' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setColor('white')}>White</span>
                    <span className={`item cursor-pointer ${color === 'purple' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setColor('purple')}>Purple</span>
                    <span className={`item cursor-pointer ${color === 'yellow' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setColor('yellow')}>Yellow</span>
                    <span className={`item cursor-pointer ${color === 'black' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setColor('black')}>Black</span>
                </div>
            </div>

            <div className={`list`}> 
                <div className={`w-full pl-3 title cursor-pointer font-bold text-lg`} onClick={() => isOpen('pricerange')}>
                    {
                        pricerangeOpen ? <MdArrowDropDown className='inline'/> : <MdArrowRight className='inline'/>
                    }
                    <span>Price Range</span>
                </div>
                <div className={`list pl-7 cursor-pointer flex flex-col ${pricerangeOpen ? 'block' : 'hidden'} text-[14px] gap-1`}>
                    <span className={`item cursor-pointer ${pricerange === '$0 - $25' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setPricerange('$0 - $25')}>$0 - $25</span>
                    <span className={`item cursor-pointer ${pricerange === '$25 - $50' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setPricerange('$25 - $50')}>$25 - $50</span>
                    <span className={`item cursor-pointer ${pricerange === '$50+' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setPricerange('$50+')}>$50+</span>
                </div>
            </div>

        </div>
    )
}

export default SideBar  