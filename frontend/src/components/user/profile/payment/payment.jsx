
import {useState, useEffect} from 'react'
import { FaPlus, FaArrowLeft } from "react-icons/fa6";
import { toast } from 'react-toastify';

import { usePaymentMethods, useAddPayment, useRemovePayment, useEditDefaultPayment } from "../../../../hooks/user/user";

const Payment = () => {
    const [ newState, setNewState ] = useState("none")
    const [ mobileErrors, setMobileErrors ] = useState({})
    const [ cardErrors, setCardErrors ] = useState({})
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

    // get user's existing payment methods
    const { data: paymentMethods, isLoading: paymentMethodsLoading, error: paymentMethodsError, refetch: refetchPaymentMethods } = usePaymentMethods();

    // add payment method
    const { mutate: addPayment, isLoading: addPaymentLoading, error: addPaymentError, data: addPaymentData } = useAddPayment();

    // remove payment method
    const { mutate: removePayment, isLoading: removePaymentLoading, error: removePaymentError, data: removePaymentData } = useRemovePayment();

    // change default payment method
    const { mutate: editDefaultPayment, isLoading: editDefaultPaymentLoading, error: editDefaultPaymentError, data: editDefaultPaymentData } = useEditDefaultPayment();


    const handleMobileChange = (e) => {
        const { name, value } = e.target;

        if (name === 'firstName') {
            setMobileErrors({
                firstName: ``
            });

            // only allow letters
            if (/[^A-Za-z]/.test(value)) {
                setMobileErrors({
                    firstName: `Invalid character`
                });
                return;
            }

            // ensure name is less than 50 characters long
            if (value.length > 50) {
                setMobileErrors({
                    firstName: `Name length cannot exceed 50 characters`
                });
                return;
            }

            setNewMobile({
                ...newMobile,
                [name]: value
            })
        } else if (name === 'lastName') {

            setMobileErrors({
                lastName: ``
            });

            // only allow letters
            if (/[^A-Za-z]/.test(value)) {
                setMobileErrors({
                    lastName: `Invalid character`
                });
                return;
            }

            // ensure name is less than 50 characters long
            if (value.length > 50) {
                setMobileErrors({
                    lastName: `Name length cannot exceed 50 characters`
                });
                return;
            }

            setNewMobile({
                ...newMobile,
                [name]: value
            })
        } else  if (name === 'phoneNumber') {
            setMobileErrors({
                phoneNumber: ``
            });

            //only allow digits
            if (/\D/.test(value)) {
                setMobileErrors({
                    phoneNumber: 'Invalid character'
                });
                return;
            }
            
            // check length
            if (value.length > 10) {
                setMobileErrors({
                    phoneNumber: 'Phone number cannot exceed 10 digits'
                });
                return;
            }
            setNewMobile({
                ...newMobile,
                [name]: e.target.value
            })
        }
    }

    const handleCardChange = (e) => {
        setNewCard({
            ...newCard,
            [e.target.name]: e.target.value
        })
    }

    const validateMobileDetails = () => {
        const errors = {}

        if (!newMobile.firstName){
            errors.firstName = 'First name is required'
        } else {
            if (!/^[A-Za-z]+$/.test(newMobile.firstName)) {
                errors.firstName = 'First name can only contain letters';
            } else if (newMobile.firstName.length < 2 || newMobile.firstName.length > 50) {
                errors.firstName = 'First name must be between 2 and 50 characters';
            }
        } 

        

        if (!newMobile.lastName){
            errors.lastName = 'Last name is required'
        } else {
            if (!/^[A-Za-z]+$/.test(newMobile.lastName)) {
                errors.lastName = 'First name can only contain letters';
            } else if (newMobile.lastName.length < 2 || newMobile.lastName.length > 50) {
                errors.lastName = 'Last name must be between 2 and 50 characters';
            }

        }

        if (!newMobile.phoneNumber){
            errors.phoneNumber = 'Phone number is required'
        } else{
            // must contain only digits
            if (!/^\d+$/.test(newMobile.phoneNumber)) {
                errors.phoneNumber = 'Invalid character(s)';
            } 
            // exactly 10 digits
            else if (!/^\d{10}$/.test(newMobile.phoneNumber)) {
                errors.phoneNumber = 'Phone number cannot exceed 10 digits';
            } 
            // starts with 07 or 01
            else if (!/^(07|01)/.test(newMobile.phoneNumber)) {
                errors.phoneNumber = 'Phone number must start with 07 or 01';
            }
        }

        if (!newMobile.provider){
            errors.provider = 'Please select your provider'
        } else {
            const validProviders = ['mpesa', 'airtel', 'tkash']
            if (!validProviders.includes(newMobile.provider)){
                errors.provider = 'Invalid provider'
            }
        }

        return errors
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
            
            const validationErrors = validateMobileDetails()
            
            if (Object.keys(validationErrors).length > 0) {
                setCardErrors(validationErrors);
                return;
            }

             

        } else if (type === 'mobile') {

            console.log("mobile submitting")
            const validationErrors = validateMobileDetails()
            
            if (Object.keys(validationErrors).length > 0) {
                setMobileErrors(validationErrors);
                return;
            }

            addPayment({
                type: 'mobile',
                details: {
                    number: newMobile.phoneNumber,
                    brand: newMobile.provider,
                    firstName: newMobile.firstName,
                    lastName: newMobile.lastName
                }
            }, {
                onSuccess: (data) => {
                    console.log('Payment option uccessfully added:', data);
                    
    
                    // refetchdata
                    refetchPaymentMethods()
                    
                    toast.success('Payment option added successfully!', {
                        className: 'custom-toast--success',
                    });
                    
                    setNewState("none")
    
                },
                onError: (error) => {
                    console.error('Login failed:', error);
                    // Handle specific error messages from API
                    if (error.response?.status === 400) {
                        // setMobileErrors({ 
                        //     firstName: 'Invalid data',
                        //     lastName: 'Invalid data',
                        //     phoneNumber: 'Invalid data',
                        //     provider: 'Invalid data',
                        // });
                        toast.error('Failed to add payment option. Please try again', {
                        className: 'custom-toast--error',
                    });
                    } else {
                        // setMobileErrors({ general: 'Login failed. Please try again.' });
                        toast.error('Failed to add payment option. Please try again', {
                        className: 'custom-toast--error',
                    });
                    }
                }
            });
        }
    }


    useEffect(() => {
        if(newState === 'card') {
            // focus on first input field
            document.getElementById('cardNumber').focus()
        } else if(newState === 'mobile') {
            // focus on first input field
            document.getElementById('firstName').focus()
        }
    }, [newState])


    useEffect(() => {
        refetchPaymentMethods()
        console.log("refetching payment methods: ", paymentMethods)
    },[])
    console.log("refetching payment methods: ", paymentMethods)

    return (
        <div className=''>
            
            {(newState === 'none') &&
                <div className='p-3 flex flex-col gap-5'>
                    <div className="title border-b border-gray-300 w-10/10 p-3">
                        <span className="title text-xl font-bold ">Payment</span>
                    </div>
                    <div className="methods flex flex-col gap-5">
                        <div className="saved">
                            <div className="mobile">
                                <span className="text font-semibold">Your mobile money accounts</span>
                                <div className="flex py-5">
                                    {paymentMethods?.data?.mobile.map((mobile) => (
                                    <div key={mobile._id} className="mobile-account flex flex-col gap-1 p-2 border border-gray-300 rounded-md">
                                        <span className="text font-semibold">{mobile.brand}</span>
                                        <span className="text text-sm">**** **** **** {mobile.lastFour}</span>
                                    </div>
                                    ))}
                                    <div className="add">
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex gap-1 items-center justify-center" onClick={() => setNewState('mobile')}>
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="cards">
                                <span className="text font-semibold">Your cards</span>
                                <div className="flex py-5">
                                    {paymentMethods?.data?.cards.map((card) => (
                                        <div key={card._id} className="card-account flex flex-col gap-1 p-2 border border-gray-300 rounded-md">
                                            <span className="text font-semibold">{card.brand}</span>
                                            <span className="text text-sm">**** **** **** {card.lastFour}</span>
                                        </div>
                                    ))}
                                    <div className="add">
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex gap-1 items-center justify-center" onClick={() => setNewState('card')}>
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                                
                    </div>
                </div>
            
            }

            
            {(newState === 'mobile') &&
                <div className="p-3 flex flex-col gap-5">
                    <div className="title flex gap-3 border-b border-gray-300 w-10/10 p-3">
                        <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" onClick={() => setNewState("none")} />
                        <span className="title text-xl font-bold">Add mobile money Account</span>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={(e) => handleSubmit(e, 'mobile')}>
                        <div className="relative flex flex-col justify-between w-full max-w-90 gap-2">
                            <span className="text font-semibold">Name: </span>

                            <div className="flex justify-between w-full gap-4">
                            
                            <div className="flex flex-col">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${mobileErrors?.firstName ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition'} rounded-lg `}
                                type="text" 
                                id='firstName' 
                                name='firstName'
                                value={newMobile.firstName}
                                onChange={(e) => {handleMobileChange(e)}}
                                placeholder="First Name"
                            />
                            {mobileErrors?.firstName && (
                            <p className="mt-1 text-sm text-red-500">{mobileErrors?.firstName}</p>
                            )}
                            </div>

                            <div className="flex flex-col">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${mobileErrors?.lastName ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition'} rounded-lg `}
                                type="text" 
                                id='lastName' 
                                name='lastName'
                                value={newMobile.lastName}
                                onChange={(e) => {handleMobileChange(e)}}
                                placeholder="Last Name"
                            />
                                {mobileErrors?.lastName && (
                                <p className="mt-1 text-sm text-red-500">{mobileErrors?.lastName}</p>
                                )} 
                            </div>
                            </div>

                        </div>

                        <div className="relative flex flex-col justify-between w-full max-w-90 gap-2">

                            <span className="text font-semibold">Phone Number: </span>
                            <div className="flex items-start gap-2">

                                <span className="text font-semibold border border-gray-300 rounded-lg py-1.5 px-1.5">
                                    +254
                                </span>
                                <div className="flex flex-col">
                                <input 
                                    className={`w-full pl-4 pr-2 py-1.5 border ${mobileErrors?.phoneNumber ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition'} rounded-lg `}
                                    type='text'
                                    id='phoneNumber' 
                                    name='phoneNumber'
                                    value={newMobile.phoneNumber}
                                    onChange={(e) => {handleMobileChange(e)}}
                                    placeholder="0712345678"
                                />


                                {mobileErrors?.phoneNumber && (
                                <p className="mt-1 text-sm text-red-500">{mobileErrors?.phoneNumber}</p>
                                )} 
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start justify-start max-w-90">
                            

                            <div className="type flex flex-col gap-2">
                                <span className="text font-semibold">Provider: </span>

                                <div className="cont flex gap-3">

                                    <div onClick ={()=>{setNewMobile({
                                        ...newMobile,
                                        provider: 'mpesa'
                                    })}} className={`mpesa cursor-pointer bg-[url(/logos/mpesa1.png)] bg-no-repeat bg-center w-15 h-9 bg-white bg-size-[auto_33px] rounded-md border border-gray-400 ${newMobile?.provider ==='mpesa' ? 'outline-[2px] outline-offset-1 outline-active ':''}`}>

                                    </div>

                                    <div onClick ={()=>{setNewMobile({
                                        ...newMobile,
                                        provider: 'airtel'
                                    })}} className={`airtel cursor-pointer bg-[url(/logos/airtel1.png)] bg-no-repeat bg-center w-15 h-9 bg-size-[auto_29px] border bg-white border-gray-400 rounded-md ${newMobile?.provider ==='airtel' ? 'outline-[2px] outline-offset-1 outline-active ':''}`}>

                                    </div>

                                    <div onClick ={()=>{setNewMobile({
                                        ...newMobile,
                                        provider: 'tkash'
                                    })}} className={`tkash cursor-pointer bg-[url(/logos/telkom.png)] bg-no-repeat bg-center w-15 h-9 bg-[#00AACA] bg-size-[auto_17px] border border-gray-400 rounded-md ${newMobile?.provider ==='tkash' ? 'outline-[2px] outline-offset-1 outline-active ':''}`}>

                                    </div>


                                </div>


                            
                                {mobileErrors?.provider && (
                                <p className="mt-1 text-sm text-red-500">{mobileErrors?.provider}</p>
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
                                onChange={(e) => {handleChange(e)}}
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
                                onChange={(e) => {handleChange(e)}}
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
                                onChange={(e) => {handleChange(e)}}
                                placeholder="Card Number"
                            />


                            {cardErrors?.cardNumber && (
                            <p className="mt-1 text-sm text-red-500">{cardErrors?.cardNumber}</p>
                            )} 
                        </div>

                        <div className="flex gap-3 items-start justify-start max-w-90">
                            <div className="relative flex flex-col justify-between w-30  gap-1">
                                <span className="text font-semibold">Expiry Date: </span>

                                <input 
                                    className={`w-full pl-4 pr-2 py-1.5 border ${cardErrors?.expiryDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                    type='text'
                                    id='expiryDate' 
                                    name='expiryDate'
                                    value={newCard.expiryDate}
                                    onChange={(e) => {handleChange(e)}}
                                    placeholder="MM/YY"
                                />


                                {cardErrors?.expiryDate && (
                                <p className="mt-1 text-sm text-red-500">{cardErrors?.expiryDate}</p>
                                )} 
                            </div>

                            <div className="relative flex flex-col justify-between w-25 max-w-70 gap-1">
                                <span className="text font-semibold">CVV: </span>
                                <input 
                                    className={`w-full pl-4 pr-2 py-1.5 border ${cardErrors?.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                    type='text'
                                    id='cvv' 
                                    name='cvv'
                                    value={newCard.cvv}
                                    onChange={(e) => {handleChange(e)}}
                                    placeholder="CVV"
                                />


                                {cardErrors?.cvv && (
                                <p className="mt-1 text-sm text-red-500">{cardErrors?.cvv}</p>
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

                                {cardErrors?.cardType && (
                                <p className="mt-1 text-sm text-red-500">{cardErrors?.cardType}</p>
                                )} 
                            </div>

                        <div className="flex w-full justify-center">

                            <button type='submit' className='bg-active text-white p-2 rounded-md w-35'>Add Card</button>
                        </div>
                    </form>
                </div>
                </div>
            }      
        </div>
    )
}

export default Payment