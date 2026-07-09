import {useState, useEffect} from 'react'
import { FaPlus, FaArrowLeft } from "react-icons/fa6";
import { toast } from 'react-toastify';

import { usePaymentMethods, useAddPayment, useRemovePayment, useEditDefaultPayment } from "../../../hooks/user/user";

import AddCard from './addCard.jsx'
import AddMobile from './addMobile.jsx'


const CheckoutPayment = ({formData, handleChange, payMethod, setPayMethod}) => {
    const [ mobileErrors, setMobileErrors ] = useState({})
    const [ cardErrors, setCardErrors ] = useState({})
    const [ dayOpen, setDayOpen ] = useState(false)
    const [ monthOpen, setMonthOpen ] = useState(false)
    const [ yearOpen, setYearOpen ] = useState(false)
    const [ newCard, setNewCard ] = useState({
        cardNumber: '',
        expiryDate: {
            month: '',
            year: ''
        },
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




    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const years = ['2026', '2027', '2028', '2029', '2030']

    // get user's existing payment methods
    const { data: paymentMethods, isLoading: paymentMethodsLoading, error: paymentMethodsError, refetch: refetchPaymentMethods } = usePaymentMethods();

    // add payment method
    const { mutate: addPayment, isLoading: addPaymentLoading, error: addPaymentError, data: addPaymentData } = useAddPayment();

    const handleMobileChange = (e) => {
        const { name, value } = e.target;

        if (name === 'firstName') {
            setMobileErrors({
                ...mobileErrors,
                firstName: ``
            });

            // only allow letters
            if (/[^A-Za-z]/.test(value)) {
                setMobileErrors({
                    ...mobileErrors,
                    firstName: `Invalid character`
                });
                return;
            }

            // ensure name is less than 50 characters long
            if (value.length > 50) {
                setMobileErrors({
                    ...mobileErrors,
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
                ...mobileErrors,
                lastName: ``
            });

            // only allow letters
            if (/[^A-Za-z]/.test(value)) {
                setMobileErrors({
                    ...mobileErrors,
                    lastName: `Invalid character`
                });
                return;
            }

            // ensure name is less than 50 characters long
            if (value.length > 50) {
                setMobileErrors({
                    ...mobileErrors,
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
                ...mobileErrors,
                phoneNumber: ``
            });

            //only allow digits
            if (/\D/.test(value)) {
                setMobileErrors({
                    ...mobileErrors,
                    phoneNumber: 'Invalid character'
                });
                return;
            }
            
            // check length
            if (value.length > 10) {
                setMobileErrors({
                    ...mobileErrors,
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
        const { name, value } = e.target;
        console.log("new card info", name, value)
        if (name === 'firstName') {
            setCardErrors({
                ...cardErrors,
                firstName: ``
            });

            // only allow letters
            if (/[^A-Za-z]/.test(value)) {
                setCardErrors({
                    ...cardErrors,
                    firstName: `Invalid character`
                });
                return;
            }

            // ensure name is less than 50 characters long
            if (value.length > 50) {
                setCardErrors({
                    ...cardErrors,
                    firstName: `Name length cannot exceed 50 characters`
                });
                return;
            }

            setNewCard({
                ...newCard,
                [name]: value
            })
        } else if (name === 'lastName') {

            setCardErrors({
                ...cardErrors,
                lastName: ``
            });

            // only allow letters
            if (/[^A-Za-z]/.test(value)) {
                setCardErrors({
                    ...cardErrors,
                    lastName: `Invalid character`
                });
                return;
            }

            // ensure name is less than 50 characters long
            if (value.length > 50) {
                setCardErrors({
                    ...cardErrors,
                    lastName: `Name length cannot exceed 50 characters`
                });
                return;
            }

            setNewCard({
                ...newCard,
                [name]: value
            })
        } else  if (name === 'cardNumber') {
            setCardErrors({
                ...cardErrors,
                cardNumber: ``
            });

            //only allow digits
            if (/\D/.test(value)) {
                setCardErrors({
                    ...cardErrors,
                    cardNumber: 'Invalid character'
                });
                return;
            }
            
            // check length
            if (value.length > 16) {
                setCardErrors({
                    ...cardErrors,
                    cardNumber: 'Card number cannot exceed 16 digits'
                });
                return;
            }
            setNewCard({
                ...newCard,
                [name]: value
            })
        } else if (name === 'cvv') {
            setCardErrors({
                ...cardErrors,
                cvv: ``
            });

            //only allow digits
            if (/\D/.test(value)) {
                setCardErrors({
                    ...cardErrors,
                    cvv: 'Invalid character'
                });
                return;
            }
            
            // check length
            if (value.length > 3) {
                setCardErrors({
                    ...cardErrors,
                    cvv: 'cvv cannot exceed 3 digits'
                });
                return;
            }
            setNewCard({
                ...newCard,
                [name]: value
            })
        } 
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
                errors.phoneNumber = 'Invalid phone number';
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
        const errors = {}

        if (!newCard.firstName){
            errors.firstName = 'First name is required'
        } else {
            if (!/^[A-Za-z]+$/.test(newCard.firstName)) {
                errors.firstName = 'First name can only contain letters';
            } else if (newCard.firstName.length < 2 || newMobile.firstName.length > 50) {
                errors.firstName = 'First name must be between 2 and 50 characters';
            } 
        } 
        

        if (!newCard.lastName){
            errors.lastName = 'Last name is required'
        } else {
            if (!/^[A-Za-z]+$/.test(newCard.lastName)) {
                errors.lastName = 'First name can only contain letters';
            } else if (newCard.lastName.length < 2 || newCard.lastName.length > 50) {
                errors.lastName = 'Last name must be between 2 and 50 characters';
            }

        }

        if (!newCard.cardNumber){
            errors.cardNumber = 'Card number is required'
        } else{
            // must contain only digits
            if (!/^\d+$/.test(newCard.cardNumber)) {
                errors.cardNumber = 'Invalid character(s)';
            } 
            // exactly 16 digits
            else if (!/^\d{16}$/.test(newCard.cardNumber)) {
                errors.cardNumber = 'Invalid card number';
            } 
        }

        if (!newCard.expiryDate.month){
            errors.expiryMonth = 'Expiry month is required'
        } else{

        }

        if (!newCard.expiryDate.year){
            errors.expiryYear = 'Expiry year is required'
        } else{
            
        }

        if (!newCard.cvv){
            errors.cvv = 'CVV is required'
        } else{
            // must contain only digits
            if (!/^\d+$/.test(newCard.cvv)) {
                errors.cvv = 'Invalid character(s)';
            } 
            // exactly 3 digits
            else if (!/^\d{3}$/.test(newCard.cvv)) {
                errors.cvv = 'Invalid card number';
            } 
        }

        if (!newCard.cardType){
            errors.cardType = 'Please select your provider'
        } else {
            const validProviders = ['mastercard', 'visa', 'mpesa']
            if (!validProviders.includes(newCard.cardType)){
                errors.cardType = 'Invalid provider'
            }
        }

        return errors
    }

    const handleSubmit = (e, type) => {
        e.preventDefault()

        if (type === 'card') {
            
            const validationErrors = validateCardDetails()
            
            if (Object.keys(validationErrors).length > 0) {
                setCardErrors(validationErrors);
                return;
            }

            addPayment({
                type: 'card',
                details: {
                    cardNumber: newCard.cardNumber,
                    brand: newCard.provider,
                    firstName: newCard.firstName,
                    lastName: newCard.lastName,
                    expiryDate: newCard.expiryDate,
                    cvv: newCard.cvv,
                    brand: newCard.cardType
                }
            }, {
                onSuccess: (data) => {
                    console.log('Card added successfully:', data);
                    
    
                    // refetchdata
                    refetchPaymentMethods()
                    
                    toast.success('Card added successfully!', {
                        className: 'custom-toast--success',
                    });

                    setNewCard({
                        cardNumber: '',
                        expiryDate: {
                            month: '',
                            year: ''
                        },
                        cvv: '',
                        firstName: '',
                        lastName: '',
                        cardType: ''
                    })
                    
                    setNewState("none")
    
                },
                onError: (error) => {
                    console.error('Adding card failed:', error);
                    // handling specific error messages from API
                    if (error.response?.status === 400) {
                        // setMobileErrors({ 
                        //     firstName: 'Invalid data',
                        //     lastName: 'Invalid data',
                        //     phoneNumber: 'Invalid data',
                        //     provider: 'Invalid data',
                        // });
                        toast.error('Failed to add card. Please try again', {
                        className: 'custom-toast--error',
                    });
                    } else {
                        // setMobileErrors({ general: 'Login failed. Please try again.' });
                        toast.error('Failed to add card. Please try again', {
                        className: 'custom-toast--error',
                    });
                    }
                }
            });

             

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
                    console.log('Mobile money account added successfully:', data);
                    
    
                    // refetchdata
                    refetchPaymentMethods()
                    
                    toast.success('Mobile money account option added successfully!', {
                        className: 'custom-toast--success',
                    });

                    setNewMobile({
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        provider: ''
                    })
                    
                    setNewState("none")
    
                },
                onError: (error) => {
                    console.error('Adding mobile money account failed:', error);
                    // handling specific error messages from API
                    if (error.response?.status === 400) {
                        // setMobileErrors({ 
                        //     firstName: 'Invalid data',
                        //     lastName: 'Invalid data',
                        //     phoneNumber: 'Invalid data',
                        //     provider: 'Invalid data',
                        // });
                        toast.error('Failed to add mobile money account. Please try again', {
                        className: 'custom-toast--error',
                    });
                    } else {
                        // setMobileErrors({ general: 'Login failed. Please try again.' });
                        toast.error('Failed to add mobile money account. Please try again', {
                        className: 'custom-toast--error',
                    });
                    }
                }
            });
        }
    }

    const handleDate = (type, value) => {
        if (type === 'month') {
            setNewCard(prev => ({
                ...prev,
                expiryDate: {
                    ...prev.expiryDate,
                    month: value
                }
            }))
            setCardErrors({
                ...cardErrors,
                expiryMonth: ''
            })
            setMonthOpen(false)
        } else if (type === 'year') {
            setNewCard(prev => ({
                ...prev,
                expiryDate: {
                    ...prev.expiryDate,
                    year: value
                }
            }))
            setCardErrors({
                ...cardErrors,
                expiryYear: ''
            })
            setYearOpen(false)
        }
    }

    const handleDateToggle = (type) => {
        if (type === 'month') {
            setMonthOpen(!monthOpen)
            // setCardErrors({
            //     ...cardErrors,
            //     expiryMonth: ''
            // })
        } else if (type === 'year') {
            setYearOpen(!yearOpen)
            // setCardErrors({
            //     ...cardErrors,
            //     expiryYear: ''
            // })
        }
    }


    return (
        <div className="paymentInfo bg-gray-200 w-9/10  mt-5 rounded-lg p-3">
            <div className="title font-bold h-13 flex items-center border-b border-gray-400 w-full p-4 justify-between">
                <span>Payment Options</span>
            </div>

            <div className="flex flex-col gap-3">
                <div className="edit relative w-full h-auto py-5 px-4 flex gap-5">
                    <div onClick={()=>{setPayMethod('card')}}
                    className={`flex cursor-pointer ${payMethod === 'card' ? 'border-b-[2px] border-summaryButtons text-summaryButtons' : ''}`}>
                        <span  >Card</span>    
                    </div>
                    <div onClick={()=>{setPayMethod('mobile')}}
                    className={`flex cursor-pointer ${payMethod === 'mobile' ? 'border-b-[2px] border-summaryButtons text-summaryButtons' : ''}`}>
                        <span  >Mobile money</span>    
                    </div>
                </div>   

                {payMethod === 'card' && (
                    <div className="flex flex-col">
                        <div className="flex gap-2 items-start flex-wrap">
                            {paymentMethods?.data?.cards.map((card) => (
                                <div key={card._id} className={`mobile-account flex flex-col gap-1 px-2 `}>
                                <div className={`mpesa cursor-pointer 
                                ${card.brand === 'mastercard' && 'bg-[url(/logos/mastercard.png)] bg-size-[auto_100px]  bg-white'}
                                ${card.brand === 'visa' && 'bg-[url(/logos/visa.png)] bg-size-[auto_20px]  bg-white'} 
                                ${card.brand === 'mpesa' && 'bg-[url(/logos/global2.jpg)] bg-size-[auto_39px] bg-[#F7F7F7]'} 
                                bg-no-repeat bg-center w-22 h-13 rounded-md border border-gray-400`}>

                                </div>
                                <div className="text-sm w-full flex justify-center gap-1">
                                    <span className="text " >***</span>
                                    <span className="text">{card.lastFour}
                                    </span>
                                </div>
                            </div>
                            ))}
                            
                        </div>
                        <AddCard handleCardChange={handleCardChange} newCard={newCard} setNewCard={setNewCard} handleSubmit={handleSubmit} cardErrors={cardErrors} setCardErrors={setCardErrors} handleDate={handleDate} dayOpen={dayOpen} monthOpen={monthOpen} yearOpen={yearOpen} handleDateToggle={handleDateToggle} months={months} years={years}/>
                    </div>
                )}

                {payMethod === 'mobile' && (
                    <div className="flex flex-col">
                        <div className="flex gap-2 items-start flex-wrap">
                            {paymentMethods?.data?.mobile.map((mobile) => (
                            <div key={mobile._id} className={`mobile-account flex flex-col gap-1 px-2 `}>
                                <div className={`mpesa cursor-pointer 
                                ${mobile.brand === 'mpesa' && 'bg-[url(/logos/mpesa1.png)] bg-size-[auto_48px]  bg-white'}
                                ${mobile.brand === 'airtel' && 'bg-[url(/logos/airtel1.png)] bg-size-[auto_40px]  bg-white'} 
                                ${mobile.brand === 'tkash' && 'bg-[url(/logos/telkom.png)] bg-size-[auto_24px] bg-[#00AACA]'} 
                                bg-no-repeat bg-center w-22 h-13 rounded-md border border-gray-400`}>

                                </div>
                                <div className="text-sm w-full flex justify-center gap-1">
                                    <span className="text" >***</span>
                                    <span className="text">{mobile.lastFour}
                                    </span>
                                </div>
                            </div>
                            ))}
                            
                        </div>
                        <AddMobile handleMobileChange={handleMobileChange} newMobile={newMobile} setNewMobile={setNewMobile} handleSubmit={handleSubmit} mobileErrors={mobileErrors} setMobileErrors={setMobileErrors} />
                    </div>
                    
                )}
            </div>


        </div>
    )
}

export default CheckoutPayment