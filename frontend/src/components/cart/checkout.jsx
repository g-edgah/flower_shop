import { useState } from 'react'
import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

import { useEditUser } from '../../hooks/user.js';

const Checkout = ({ cart, subTotal, total, couponCode, setCouponCode, shippingLocation, setShippingLocation, shippingCost, setShippingCost, user, userRefetch, refetch }) => {
    const navigate = useNavigate();
    const [ addressEdit, setAddressEdit ] = useState(false)
    const [errors, setErrors] = useState({})
    const [ payMethod, setPayMethod] = useState('card')

    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        address: {
            country: user.address.country,
            region: user.address.region,
            city: user.address.city,
            address: user.address.address,
            info: user.address.info,
            mobile: user.address.mobile
        },
        paymentMethod: payMethod

    });


    const handleAccount = (state) => {
        setAccountEdit(state)
    }

    const handleAddress = (state) => {
        setAddressEdit(state)
    }

    // handle input
    const handleChange = (e) => {

        const { name, value } = e.target;


        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevData => ({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
       

        // clear error for this field when user starts typing
        if (errors[name]) {
        setErrors({
            ...errors,
            [name]: '',
        });
        }
    };




    // validate form
    const validateForm = () => {
        const newErrors = {};
        
        
        // if (formData.firstName.length < 1) {
        // newErrors.newPassword = 'Password must be at least 6 characters';
        // }
        

        // if (formData.email) {
        // !/\S+@\S+\.\S+/.test(formData.email)
        // newErrors.email = 'Email is invalid';
        // }
           
        
        return newErrors;
    };


    
    // api call
    const { mutate: editUser, isLoading, error, userdata } = useEditUser();

    //form submission
    const handleSubmit = async (e, type) => {
        e.preventDefault();
        console.log("e: ",e)



        console.log(formData)
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        editUser(formData, {
            onSuccess: (data) => {
                console.log('Edit successfull!', data)
                userRefetch()
                
            },
            onError: (error) => {
                console.error('Edit failed: ', error)
                alert('Edit failed. Please try again.')
                if (type === 'account') {
                    setAccountEdit(true)
                } else if (type === 'address') {
                    setAddressEdit(true)
                }
               
            }
        })

        if (type === 'account') {
            setAccountEdit(false)
        } else if (type === 'address') {
            setAddressEdit(false)
        }
               
    };



    return (
        <div className="checkout w-full flex justify-center items-start pt-10 pb-23">
            <div className="checkout w-6/10 flex flex-col items-center space-y-5 max-w-200">
                <div className="delivery bg-gray-200 w-9/10  rounded-lg p-3">
                    <div className="address flex flex-col  w-full rounded-md">
                    <div className="title font-bold h-13 flex items-center border-b-1 border-gray-400 w-full p-4 justify-between">
                        <span>Delivery Information</span> 
                        {!addressEdit ? 
                            <BiSolidEdit onClick={() => {handleAddress(true)}} className="size-6 cursor-pointer"/> 
                            : 
                            <IoClose onClick={() => {handleAddress(false)}} className="size-6 cursor-pointer"/>
                        }
                    </div>

                    { addressEdit ?
                        <form onSubmit={(e) => handleSubmit(e, 'address')} className="edit relative w-full h-auto py-3 flex flex-col gap-6">
                            <div className="address flex flex-col items-start justify-center px-4 space-y-3">
                                <span className="text pl-1 font-bold">Name: </span>
                                <div className="flex flex-row gap-4 w-full">
                                    <input 
                                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                        type="text" 
                                        id='firstName' 
                                        name='firstName'
                                        value={formData.firstName}
                                        onChange={(e) => {handleChange(e)}}
                                        placeholder={user.firstName}
                                    />
                                    {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                                    )} 

                                    <input 
                                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                        type="text" 
                                        id='lastName' 
                                        name='lastName'
                                        value={formData.lastName}
                                        onChange={(e) => {handleChange(e)}}
                                        placeholder={user.lastName}
                                    />
                                    {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                                    )} 
                                </div>
                            </div>

                            <div className="region flex flex-col items-start justify-center px-4 space-y-3">
                                <span className="text pl-1 font-bold">Region:</span> 
                                <input 
                                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.region ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                    type="text" 
                                    id='region' 
                                    name='address.region'
                                    value={formData.address.region}
                                    onChange={(e) => {handleChange(e)}}
                                    placeholder={user.address.region}
                                />
                                {errors.region && (
                                <p className="mt-1 text-sm text-red-500">{errors.region}</p>
                                )} 
                            </div>
                            <div className="city flex flex-col items-start justify-center px-4 space-y-3">
                                <span className="text pl-1 font-bold">City:</span> 
                                <input 
                                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.city ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                    type="text" 
                                    id='city' 
                                    name='address.city'
                                    value={formData.address.city}
                                    onChange={(e) => {handleChange(e)}}
                                    placeholder={user.address.city}
                                />
                                {errors.city && (
                                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                                )} 
                            </div>
                            <div className="address flex flex-col items-start justify-center px-4 space-y-3">
                                <span className="text pl-1 font-bold">Address: </span>
                                <input 
                                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.address ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                    type="text" 
                                    id='address' 
                                    name='address.address'
                                    value={formData.address.address}
                                    onChange={(e) => {handleChange(e)}}
                                    placeholder={user.address.address}
                                />
                                {errors.address && (
                                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                                )} 
                            
                            </div>
                            <div className="info flex flex-col items-start justify-center px-4 space-y-3">
                                <span className="text w-35 pl-1 font-bold">Additional info:</span>
                                <textarea 
                                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.info ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                    type="textarea" 
                                    id='info' 
                                    name='address.info'
                                    value={formData.address.info}
                                    onChange={(e) => {handleChange(e)}}
                                    placeholder={user.address.info}
                                />
                                {errors.info && (
                                <p className="mt-1 text-sm text-red-500">{errors.info}</p>
                                )} 
                            </div>
                            <div className="phone flex flex-col items-start justify-center px-4 space-y-3">
                                <span className="text pl-1 font-bold">Phone:</span>
                                <input 
                                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.mobile ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                    type="text" 
                                    id='mobile' 
                                    name='address.mobile'
                                    value={formData.address.mobile}
                                    onChange={(e) => {handleChange(e)}}
                                    placeholder={user.address.mobile}
                                />
                                {errors.mobile && (
                                <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
                                )} 
                            </div>

                            <div className="w-full  flex justify-center">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-30 mt-3 cursor-pointer bg-active text-white py-2 px-4 rounded-lg hover:bg-footer focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Submitting...
                                    </div>
                                    ) : (
                                    'Submit'
                                    )}
                                </button>
                            </div>
                        </form>
                    : 
                        <div className="flex flex-col">
                            <div className="address h-10 flex items-center p-4 gap-2">
                                <span className="text">Name: </span>
                                <span className="text font-bold">{user.firstName} {user.lastName}</span> 
                            </div>
                            <div className="region h-10 flex items-center p-4 gap-2">
                                <span className="text">Region:</span> 
                                <span className="text font-bold">{user.address.region}</span> 
                            </div>
                            <div className="city h-10 flex items-center p-4 gap-2">
                                <span className="text">City:</span> 
                                <span className="text font-bold">{user.address.city}</span> 
                            </div>
                            <div className="address h-10 flex items-center p-4 gap-2">
                                <span className="text">Address: </span>
                                <span className="text font-bold">{user.address.address}</span> 
                            </div>
                            <div className="info h-10 flex items-center p-4 gap-2">
                                <span className="text">Additional info:</span>
                                <span className="text font-bold">{user.address.info}</span> 
                            </div>
                            <div className="phone h-10 flex items-center p-4 gap-2">
                                <span className="text">Phone:</span>
                                <span className="text font-bold">{user.address.mobile}</span> 
                            </div>
                        </div>

                    }
                    

                </div>

                </div>
                <div className="paymentInfo bg-gray-200 w-9/10  mt-5 rounded-lg p-3">
                    <div className="title font-bold h-13 flex items-center border-b-1 border-gray-400 w-full p-4 justify-between">
                        <span>Payment Method</span>
                    </div>

                    
                    <form className="edit relative w-full h-auto py-5 px-4 flex flex-col gap-3">
                        <div className='flex gap-2'>
                            <input
                                type="radio"
                                id="card"
                                name="paymentMethod"
                                value="card"
                                className="peer"
                                checked={formData.paymentMethod === 'card'}
                                onChange={handleChange}
                            />
                            <label htmlFor="card" className="flex items-center justify-between ">
                                <span>Visa/MasterCard</span>
                                
                            </label>     
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="radio"
                                id="mpesa"
                                name="paymentMethod"
                                value="mpesa"
                                className="peer"
                                checked={formData.paymentMethod === 'mpesa'}
                                onChange={handleChange}
                            />
                            <label htmlFor="mpesa" className="flex items-center justify-between">
                                <span>MPesa</span>
                                
                            </label>     
                        </div>
                        
                    </form>   


                </div>
                <button className="bg-checkoutButtons hover:bg-checkoutButtonsHover hover:bg-gray-450 w-40 md:w-50 h-10 rounded-xl hover:shadow-md hover:shadow-gray-600 transition text-white" onClick={()=> navigate('/cart')}>go back</button>
            </div>
            <div className="summary fllex flex-col w-70 space-y-5">
                <div className="summaryContainer flex flex-col w-full max-w-[95vw] mx-auto py-3 px-4 md:p-6 space-y-4 bg-cartCard font-normal text-md text-summaryText rounded-lg">
                    <div className="cartTotal text-[22px]">
                        <span>sub total: </span>
                        <span className="amount">{subTotal}</span>
                    </div>

                    <div className="coupon">
                        <form ></form>
                        <input 
                            className="p-2 bg-white w-30 h-10 rounded-md border text-summaryButtons focus:outline-none border-gray-400"
                            type="text" 
                            placeholder="voucher code" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className='ml-4 text-summaryButtonsText bg-summaryButtons w-20 h-9.5 md:h-10 rounded-md hover:bg-active transition'>apply</button>
                    </div>

                    <div className="payableAmount flex flex-col space-y-2 md:space-y-4">
                        <span>shipping : {shippingCost}</span>
                        <span>Total: {total}</span>
                        
                    </div>

                </div>

                <div className="cartActions mx-auto justify-center flex flex-row space-x-5 md:space-x-16 text-checkoutButtonsText pr-1 pb-15">
                    
                    <button className="bg-summaryButtons w-40 md:w-50 h-10 rounded-xl hover:shadow-md hover:shadow-gray-600 hover:bg-active transition" onClick={()=> navigate('/cart/checkout')}>Confirm order</button>
                    
                </div>
            </div>
        </div>

    )
}

export default Checkout