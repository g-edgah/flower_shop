import { FaArrowLeft } from "react-icons/fa6";
import { MdKeyboardArrowDown } from "react-icons/md";
import {useState} from 'react'

const AddCard = ({ handleCardChange, handleSubmit, cardErrors, newCard, setNewState, handleDate, handleDateToggle, dayOpen, monthOpen, yearOpen, days, months, years }) => {
    

    return (
        <div className='p-3 flex flex-col gap-5'>
            <div className="title flex gap-5 items-center border-b border-gray-300 w-full p-3">
                <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" onClick={() => setNewState("none")} />
                <span className="title text-xl font-bold">Add Card</span>
            </div>
            <div className="new">

        
            <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e, 'card')}>
                <div className="relative flex flex-col justify-between w-full max-w-90 gap-1">
                    <span className="text font-semibold">Card Holder Name: </span>

                    
                    <div className="flex justify-between w-full gap-4">

                    <input 
                        className={`w-full pl-4 pr-2 py-1.5 border ${cardErrors?.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                        type="text" 
                        id='firstName' 
                        name='firstName'
                        value={newCard.firstName}
                        onChange={(e) => {handleCardChange(e)}}
                        placeholder="First Name"
                    />
                    {cardErrors?.firstName && (
                    <p className="mt-1 text-sm text-red-500">{cardErrors?.firstName}</p>
                    )} 

                    <input 
                        className={`w-full pl-4 pr-2 py-1.5 border ${cardErrors?.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                        type="text" 
                        id='lastName' 
                        name='lastName'
                        value={newCard.lastName}
                        onChange={(e) => {handleCardChange(e)}}
                        placeholder="Last Name"
                    />
                        {cardErrors?.lastName && (
                        <p className="mt-1 text-sm text-red-500">{cardErrors?.lastName}</p>
                        )} 
                    </div>
                </div>

                <div className="relative flex flex-col justify-between w-full max-w-90 gap-1">

                    <span className="text font-semibold">Card Number: </span>

                    <input 
                        className={`w-full pl-4 pr-2 py-1.5 border ${cardErrors?.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                        type='text'
                        id='cardNumber' 
                        name='cardNumber'
                        value={newCard.cardNumber}
                        onChange={(e) => {handleCardChange(e)}}
                        placeholder="Card Number"
                    />


                    {cardErrors?.cardNumber && (
                    <p className="mt-1 text-sm text-red-500">{cardErrors?.cardNumber}</p>
                    )} 
                </div>

                <div className="flex gap-3 items-start justify-start max-w-90">
                    <div className="relative flex flex-col justify-between w-full  gap-2">
                        <span className="text font-semibold">Expiry Date: </span>
                        <div className="flex justify-between">

                        <div className="flex flex-col w-20">

                        <div className={`w-full relative`}>
                            <div className={`sort py-1.5 px-2 flex justify-between items-center cursor-pointer border border-gray-300 min-h-9.75 
                            ${dayOpen ? 'rounded-t-lg' : 'rounded-lg'} w-full border 
                            ${cardErrors?.expiryDay ? 'border-red-500' : ''} 
                             focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`} onClick={()=>{handleDateToggle('day')}}>
                                <span>{newCard.expiryDate.day}</span>
                                <MdKeyboardArrowDown />
            
                            </div>
                            <div className={`options absolute z-50 flex flex-col ${dayOpen ? 'block' : 'hidden'} w-full p-3 bg-cartCard rounded-b-md shadow-xl/70 gap-2`}>
                            { days.map((day, index)=> {
                                return (
                                <span key={index} className="item cursor-pointer" onClick={() => handleDate('day',day)}>{day}</span>
                            )})}
                            </div>
                            
                        </div>


                        {cardErrors?.expiryDay && (
                        <p className="mt-1 text-sm text-red-500">{cardErrors?.expiryDay}</p>
                        )} 
                        </div>
                        <div className="flex flex-col w-35">

                        <div className={`w-full relative`}>
                            <div className={`sort py-1.5 px-2 flex justify-between items-center cursor-pointer border border-gray-300 min-h-9.75 
                            ${monthOpen ? 'rounded-t-lg' : 'rounded-lg'} w-full border 
                            ${cardErrors?.expiryMonth ? 'border-red-500' : ''} 
                             focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`} onClick={()=>{handleDateToggle('month')}}>
                                <span>{newCard.expiryDate.month}</span>
                                <MdKeyboardArrowDown />
            
                            </div>
                            <div className={`options absolute z-50 flex flex-col ${monthOpen ? 'block' : 'hidden'} w-full p-3 bg-cartCard rounded-b-md shadow-xl/70 gap-2`}>
                                { months.map((month, index)=> {
                                return (
                                <span key={index} className="item cursor-pointer" onClick={() => handleDate('month',month)}>{month}</span>
                            )})}
                            </div>
                            
                        </div>


                        {cardErrors?.expiryMonth && (
                        <p className="mt-1 text-sm text-red-500">{cardErrors?.expiryMonth}</p>
                        )} 
                        </div>

                        <div className="flex flex-col w-27">

                        <div className={`w-full relative`}>
                            <div className={`sort py-1.5 px-2 flex justify-between items-center cursor-pointer border border-gray-300 min-h-9.75 
                            ${yearOpen ? 'rounded-t-lg' : 'rounded-lg'} w-full border 
                            ${cardErrors?.expiryYear ? 'border-red-500' : ''} 
                             focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`} onClick={()=>{handleDateToggle('year')}}>
                                <span>{newCard.expiryDate.year}</span>
                                <MdKeyboardArrowDown />
            
                            </div>
                            <div className={`options absolute z-50 flex flex-col ${yearOpen ? 'block' : 'hidden'} w-full p-3 bg-cartCard rounded-b-md shadow-xl/70 gap-2`}>
                                { years.map((year, index)=> {
                                return (
                                <span key={index} className="item cursor-pointer" onClick={() => handleDate('year',year)}>{year}</span>
                            )})}
                            </div>
                            
                        </div>


                        {cardErrors?.expiryYear && (
                        <p className="mt-1 text-sm text-red-500">{cardErrors?.expiryYear}</p>
                        )} 
                        </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between max-w-90">
                    <div className="relative flex flex-col justify-between w-25 max-w-70 gap-1">
                        <span className="text font-semibold">CVV: </span>
                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${cardErrors?.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type='text'
                            id='cvv' 
                            name='cvv'
                            value={newCard.cvv}
                            onChange={(e) => {handleCardChange(e)}}
                            placeholder="CVV"
                        />


                        {cardErrors?.cvv && (
                        <p className="mt-1 text-sm text-red-500">{cardErrors?.cvv}</p>
                        )} 
                    </div>
                    <div className="type flex flex-col gap-1">
                            <span className="text font-semibold">Card Type: </span>

                            <div className="cont flex gap-2">

                            <div className="mastercard bg-[url(/logos/mastercard.png)] bg-no-repeat bg-center w-15 h-9 bg-size-[auto_80px] border border-gray-400 rounded-md">

                            </div>

                            <div className="mastercard bg-[url(/logos/visa.png)] bg-no-repeat bg-center w-15 h-9 bg-size-[auto_16px] border border-gray-400 rounded-md">

                            </div>

                            <div className="mpesa bg-[url(/logos/global2.jpg)] bg-no-repeat bg-[#F7F7F7] bg-center w-15 h-9 bg-size-[auto_27px] border border-gray-400 rounded-md">

                            </div>


                            </div>
                            


                            {/* <select 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.cardType ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                id='cardType' 
                                name='cardType'
                                value={newCard.cardType}
                                onChange={(e) => {handleChange(e)}}
                            >
                                <option value="">Select Card Type</option>
                                <option value="Visa">Visa</option>
                                <option value="MasterCard">MasterCard</option>
                                <option value="Amex">Amex</option>
                            </select> */}

                            {cardErrors?.cardType && (
                            <p className="mt-1 text-sm text-red-500">{cardErrors?.cardType}</p>
                            )} 
                        </div>
                    </div>

                    <div className="flex w-full justify-center">

                        <button type='submit' className='bg-active text-white p-2 rounded-md w-35'>Add Card</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCard