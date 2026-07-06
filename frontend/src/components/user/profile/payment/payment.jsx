
import {useState, useEffect} from 'react'

const Payment = () => {
    const [ newCardState, setNewCardState ] = useState(false)
    const [ newMobileState, setNewMobileState ] = useState(false)
    const [ newState, setNewState ] = useState("mobile")
    const [ errors, setErrors ] = useState({})
    const [ newCard, setNewCard ] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        firstName: '',
        lastName: '',
        cardType: ''
    })
    const [ newMobile, setNewMobile ] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        provider: ''
    })


    const handleChange = (e) => {
        setNewCard({
            ...newCard,
            [e.target.name]: e.target.value
        })
    }

    const validateCardDetails = (number) => {
        // Remove spaces and dashes
        const cleaned = number.replace(/[\s-]/g, '');
        // Check if it's all digits and has a length of 16
        return /^\d{16}$/.test(cleaned);


    }

    const handleSubmit = (e, type) => {
        e.preventDefault()

        if (type === 'card') {
            validateCardDetails()
            // submit new card to backend
        } else if (type === 'mobile') {
            // submit new mobile money account to backend
        }
    }

    useEffect(() => {
        if(newCardState){
            // focus on first input field
            document.getElementById('cardNumber').focus()
        }
    }, [newCardState])


    return (
        <div className='p-3 flex flex-col gap-5'>
            <div className="title border-b border-gray-300 w-10/10 p-3">
                <span className="title text-xl font-bold ">Payment</span>
            </div>
            <div className="methods flex flex-col gap-5">
                <div className="saved">
                    <div className="mobile">
                        <span className="text">Your mobile money accounts</span>
                    </div>
                    <div className="cards">
                        <span className="text">Your cards</span>
                    </div>
                </div>

                {(newState === 'card' || newState === 'mobile') &&
                    <div className="new">
                        {(newState === 'mobile') &&
                        <div className="card flex flex-col gap-5">
                            <span className="text font-semibold">Add New Mobile Money Account</span>

                            <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e, 'mobile')}>
                                <div className="relative flex flex-col justify-between w-full max-w-90 gap-1">
                                    <span className="text font-semibold">Name: </span>

                                    <div className="flex justify-between w-full gap-4">

                                    <input 
                                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                        type="text" 
                                        id='firstName' 
                                        name='firstName'
                                        value={newMobile.firstName}
                                        onChange={(e) => {handleChange(e)}}
                                        placeholder="First Name"
                                    />
                                    {errors.mobileFirstName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.mobileFirstName}</p>
                                    )} 

                                    <input 
                                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                        type="text" 
                                        id='lastName' 
                                        name='lastName'
                                        value={newMobile.lastName}
                                        onChange={(e) => {handleChange(e)}}
                                        placeholder="Last Name"
                                    />
                                        {errors.lastName && (
                                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                        )} 
                                    </div>


                                    {errors.mobileLastName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.mobileLastName}</p>
                                    )} 
                                </div>

                                <div className="relative flex flex-col justify-between w-full max-w-90 gap-1">

                                    <span className="text font-semibold">Phone Number: </span>

                                    <input 
                                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                        type='text'
                                        id='phoneNumber' 
                                        name='phoneNumber'
                                        value={newMobile.phoneNumber}
                                        onChange={(e) => {handleChange(e)}}
                                        placeholder="Phone Number"
                                    />


                                    {errors.phoneNumber && (
                                    <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                                    )} 
                                </div>

                                <div className="flex gap-3 items-start justify-start max-w-90">
                                    

                                    <div className="type flex flex-col gap-1">
                                        <span className="text font-semibold">Provider: </span>

                                        <div className="cont flex gap-2">

                                        <div className="mpesa bg-[url(/logos/mpesa1.png)] bg-no-repeat bg-center w-15 h-9 bg-white bg-size-[auto_33px] border border-gray-400 rounded-md">

                                        </div>

                                        <div className="airtel bg-[url(/logos/airtel1.png)] bg-no-repeat bg-center w-15 h-9 bg-size-[auto_29px] border bg-white border-gray-400 rounded-md">

                                        </div>

                                        <div className="tkash bg-[url(/logos/telkom.png)] bg-no-repeat bg-center w-15 h-9 bg-[#00AACA] bg-size-[auto_17px] border border-gray-400 rounded-md">

                                        </div>


                                        </div>


                                        

                                        {errors.provider && (
                                        <p className="mt-1 text-sm text-red-500">{errors.provider}</p>
                                        )} 
                                    </div>
                                </div>

                                <div className="flex w-full justify-center">

                                    <button type='submit' className='bg-active text-white p-2 rounded-md w-35'>Add Mobile</button>
                                </div>
                            </form>
                        
                            
                        </div>
                        }

                        {(newState === 'card') &&
                        <div className="card flex flex-col gap-5">
                            <span className="text font-semibold">Add New Card</span>

                            
                        
                            <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e, 'card')}>
                                <div className="relative flex flex-col justify-between w-full max-w-90 gap-1">
                                    <span className="text font-semibold">Card Holder Name: </span>

                                    <input 
                                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.holderName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                        type='text'
                                        id='holderName' 
                                        name='holderName'
                                        value={newCard.holderName.firstName + ' ' + newCard.holderName.lastName}
                                        onChange={(e) => {handleChange(e)}}
                                        placeholder="Holder Name"
                                    />


                                    {errors.holderName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.holderName}</p>
                                    )} 
                                </div>

                                <div className="relative flex flex-col justify-between w-full max-w-90 gap-1">

                                    <span className="text font-semibold">Card Number: </span>

                                    <input 
                                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                        type='text'
                                        id='cardNumber' 
                                        name='cardNumber'
                                        value={newCard.cardNumber}
                                        onChange={(e) => {handleChange(e)}}
                                        placeholder="Card Number"
                                    />


                                    {errors.cardNumber && (
                                    <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                                    )} 
                                </div>

                                <div className="flex gap-3 items-start justify-start max-w-90">
                                    <div className="relative flex flex-col justify-between w-30  gap-1">
                                        <span className="text font-semibold">Expiry Date: </span>

                                        <input 
                                            className={`w-full pl-4 pr-2 py-1.5 border ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                            type='text'
                                            id='expiryDate' 
                                            name='expiryDate'
                                            value={newCard.expiryDate}
                                            onChange={(e) => {handleChange(e)}}
                                            placeholder="MM/YY"
                                        />


                                        {errors.expiryDate && (
                                        <p className="mt-1 text-sm text-red-500">{errors.expiryDate}</p>
                                        )} 
                                    </div>

                                    <div className="relative flex flex-col justify-between w-25 max-w-70 gap-1">
                                        <span className="text font-semibold">CVV: </span>
                                        <input 
                                            className={`w-full pl-4 pr-2 py-1.5 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                            type='text'
                                            id='cvv' 
                                            name='cvv'
                                            value={newCard.cvv}
                                            onChange={(e) => {handleChange(e)}}
                                            placeholder="CVV"
                                        />


                                        {errors.cvv && (
                                        <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>
                                        )} 
                                    </div>

                                    
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

                                        {errors.cardType && (
                                        <p className="mt-1 text-sm text-red-500">{errors.cardType}</p>
                                        )} 
                                    </div>

                                <div className="flex w-full justify-center">

                                    <button type='submit' className='bg-active text-white p-2 rounded-md w-35'>Add Card</button>
                                </div>
                            </form>
                        </div>
                        }
                    
                    </div>
                }
            </div>
        </div>
    )
}

export default Payment