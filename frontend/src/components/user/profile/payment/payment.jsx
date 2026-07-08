
import {useState, useEffect} from 'react'
import { FaPlus, FaArrowLeft } from "react-icons/fa6";
import { toast } from 'react-toastify';

import { usePaymentMethods, useAddPayment, useRemovePayment, useEditDefaultPayment } from "../../../../hooks/user/user";

import AddCard from './addCard.jsx'
import AddMobile from './addMobile.jsx'


const Payment = () => {
    const [ newState, setNewState ] = useState("none")
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

    const days = ['01', '02', '03', '04' ]
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const years = ['2026', '2027', '2028', '2029']

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
            if (value.length > 10) {
                setCardErrors({
                    ...cardErrors,
                    cardNumber: 'Phone number cannot exceed 10 digits'
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
            // exactly 10 digits
            else if (!/^\d{10}$/.test(newCard.cardNumber)) {
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
            if (!validProviders.includes(newMobile.cardType)){
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

                    setNewMobile({
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        provider: ''
                    })
                    
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
                                <div className="flex py-5 gap-3 items-start">
                                    {paymentMethods?.data?.mobile.map((mobile) => (
                                    <div key={mobile._id} className={`mobile-account flex flex-col gap-1 px-2 `}>
                                        <div className={`mpesa cursor-pointer 
                                        ${mobile.brand === 'mpesa' && 'bg-[url(/logos/mpesa1.png)] bg-size-[auto_48px]  bg-white'}
                                        ${mobile.brand === 'airtel' && 'bg-[url(/logos/airtel1.png)] bg-size-[auto_40px]  bg-white'} 
                                        ${mobile.brand === 'tkash' && 'bg-[url(/logos/telkom.png)] bg-size-[auto_24px] bg-[#00AACA]'} 
                                        bg-no-repeat bg-center w-22 h-13 rounded-md border border-gray-400`}>

                                        </div>
                                        <div className="text-sm w-full flex">
                                            <span className="text  min-w-11 " >*******</span>
                                            <span className="text w-4">{mobile.lastFour}
                                            </span>
                                        </div>
                                    </div>
                                    ))}
                                    <div className="add">
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex gap-1 items-center justify-center h-13" onClick={() => setNewState('mobile')}>
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
                                        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex gap-1 items-center justify-center h-13" onClick={() => setNewState('card')}>
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
                <AddMobile handleMobileChange={handleMobileChange} newMobile={newMobile} setNewMobile={setNewMobile} handleSubmit={handleSubmit} mobileErrors={mobileErrors} setMobileErrors={setMobileErrors} setNewState={setNewState}/>
                    
            }

            {(newState === 'card') &&
                <AddCard handleCardChange={handleCardChange} newCard={newCard} setNewCard={setNewCard} handleSubmit={handleSubmit} cardErrors={cardErrors} setCardErrors={setCardErrors} setNewState={setNewState} handleDate={handleDate} dayOpen={dayOpen} monthOpen={monthOpen} yearOpen={yearOpen} handleDateToggle={handleDateToggle} days={days} months={months} years={years}/>
            }      
        </div>
    )
}

export default Payment