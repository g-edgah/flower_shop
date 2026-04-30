import { useState } from 'react';

import { MdArrowRight } from "react-icons/md";
import { MdArrowDropDown } from "react-icons/md";

import FlowerCard from '../home/flowerCard.jsx'


const SideBar = () => {
    const [occasionsOpen, setOccasionsOpen] = useState(true);
    const [colorsOpen, setColorsOpen] = useState(false);
    const [pricerangeOpen, setPricerangeOpen] = useState(false);

    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(99999);
    const [inputMin, setInputMin] = useState(0);
    const [inputMax, setInputMax] = useState(99999);

    const [occasion, setOccasions] = useState('all');
    const [color, setColor] = useState('all');
    const [pricerange, setPricerange] = useState('all');

    const handleApply = () => {
        setMinPrice(inputMin);
        setMaxPrice(inputMax);
    };

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
                    <span>Occasions</span>
                </div>
                <div className={`flex pl-7 flex-col list ${occasionsOpen ? 'block' : 'hidden'} text-[14px] gap-1`}>
                    <span className={`item cursor-pointer ${occasion === 'all' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('all')}>All</span>
                    <span className={`item cursor-pointer ${occasion === 'birthday' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('birthday')}>Birthday</span>
                    <span className={`item cursor-pointer ${occasion === 'none' ? 'font-semibold' : 'font-light text-gray-700'}`} onClick={() => setOccasions('none')}>No Occasion</span>
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

                <div className={`list pl-7 flex flex-wrap ${colorsOpen ? 'block' : 'hidden'} gap-2 max-w-55 pt-4`}>

                   <div  className={`color rounded-full size-12 flex items-center justify-center ${color === 'all' ? 'border' : ''}`} onClick={() => setColor('all')}>
                    <div className="color size-10 rounded-full" style={{
                        background: "conic-gradient(red, yellow, green, cyan, blue, magenta, red)"
                        }}>
                    </div>
                    </div>
                    <div className={`color rounded-full size-12 flex items-center justify-center ${color === 'red' ? 'border' : ''}`} onClick={() => setColor('red')}>
                        <div className="color size-10 rounded-full bg-red-600"></div>
                    </div>
                    <div className={`color rounded-full size-12 flex items-center justify-center ${color === 'Pink' ? 'border' : ''}`} onClick={() => setColor('Pink')}>
                        <div className="color size-10 rounded-full bg-pink-500"></div>
                    </div>
                    <div className={`color rounded-full size-12 flex items-center justify-center ${color === 'blue' ? 'border' : ''}`} onClick={() => setColor('blue')}>
                        <div className="color size-10 rounded-full bg-blue-500"></div>
                    </div>
                    <div className={`color rounded-full size-12 flex items-center justify-center ${color === 'white' ? 'border' : ''}`} onClick={() => setColor('white')}>
                        <div className="color size-10 rounded-full bg-white border"></div>
                    </div>
                    <div className={`color rounded-full size-12 flex items-center justify-center ${color === 'purple' ? 'border' : ''}`} onClick={() => setColor('purple')}>
                        <div className="color size-10 rounded-full bg-purple-500"></div>
                    </div>
                    <div className={`color rounded-full size-12 flex items-center justify-center ${color === 'yellow' ? 'border' : ''}`} onClick={() => setColor('yellow')}>
                        <div className="color size-10 rounded-full bg-yellow-500"></div>
                    </div>
                    <div className={`color rounded-full size-12 flex items-center justify-center ${color === 'black' ? 'border' : ''}`} onClick={() => setColor('black')}>
                        <div className="color size-10 rounded-full bg-black"></div>
                    </div>
                </div>
            </div>



            <div className="p-6">

            
            <div>
            
            <div className={`w-full title cursor-pointer font-bold text-md`} onClick={() => isOpen('pricerange')}>
                {
                    pricerangeOpen ? <MdArrowDropDown className='inline'/> : <MdArrowRight className='inline'/>
                }
                <span>Price Range(KSh)</span>
            </div>
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                

                <button 
                onClick={handleApply}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700 transition"
                >
                Apply
                </button>
            </div>

            {/* Double Slider */}
            <div className="relative pt-2">
                <input
                type="range"
                min={0}
                max={99999}
                value={inputMin}
                onChange={(e) => setInputMin(Math.min(Number(e.target.value), inputMax - 1000))}
                className="absolute w-full h-1 bg-active rounded-lg appearance-none cursor-pointer"
                />
                <input
                type="range"
                min={0}
                max={99999}
                value={inputMax}
                onChange={(e) => setInputMax(Math.max(Number(e.target.value), inputMin + 1000))}
                className="absolute w-full h-1 bg-active rounded-lg appearance-none cursor-pointer"
                />
                
                {/* Progress bar between min and max */}
                <div className="relative h-1 bg-cartCard rounded-full">
                <div 
                    className="absolute h-1 bg-active rounded-full"
                    style={{
                    left: `${(inputMin / 99999) * 100}%`,
                    right: `${100 - (inputMax / 99999) * 100}%`
                    }}
                ></div>
                </div>
            </div>

            {/* Range Labels */}
            <div className="flex justify-between text-xs text-gray-400 mt-4">
                <span>0</span>
                <span>25k</span>
                <span>50k</span>
                <span>75k</span>
                <span>100k</span>
            </div>

            {/* Price Range Values */}
            <div className="flex items-center justify-between gap-1 mb-6 mt-6">
                {/* Min Price */}
                <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">Min</label>
                <input
                    type="number"
                    value={inputMin}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0 && value < inputMax) {
                            setInputMin(value);
                        }
                    }}
                    className="text-sm border rounded-md px-2 py-1 w-21"
                />
                
                </div>

                {/* Separator */}
                <div className="text-gray-400 text-sm pt-5">—</div>

                {/* Max Price */}
                <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block w-full text-end">Max</label>
                <input
                    type="number"
                    value={inputMax}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value < 100000 && value > inputMin) {
                            setInputMax(value);
                        }
                    }}
                    className="text-sm border rounded-md px-2 py-1 w-21"
                />
                
                </div>
            </div>

            
            </div>
            </div>

        </div>
    )
}

export default SideBar  