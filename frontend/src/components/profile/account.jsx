import { useState } from 'react'
import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import axios from 'axios'

import { useEditUser } from '../../hooks/user.js';


const Account = ({refetch, user}) => {
    const [ accountEdit, setAccountEdit ] = useState(false)
    const [ addressEdit, setAddressEdit ] = useState(false)
    const [errors, setErrors] = useState({})


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
        }

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
                refetch()
                
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
        <div className="flex p-4 justify-around gap-4 w-full">
            <div className="account flex flex-col border-[1.75px] border-gray-400 w-5/10 rounded-md bg-gray-200">
                <div className="title font-bold h-13 flex items-center border-b-1 border-gray-400 w-full p-4 flex justify-between ">
                    <span>Account Details</span> 
                    {!accountEdit ? 
                        <BiSolidEdit onClick={() => {handleAccount(true)}} className="size-6 cursor-pointer"/> 
                        : 
                        <IoClose onClick={() => {handleAccount(false)}} className="size-6 cursor-pointer"/>
                    }
                </div>

                { accountEdit ?
                    <form onSubmit={(e) => handleSubmit(e, 'account')} className="edit relative h-105 py-4 flex flex-col gap-4 w-full">
                        <div className="address h-10 flex items-center p-4 gap-2">
                            <span className="text">Email: </span>
                            <span className="text">{user.email}</span> 
                        </div>
                        
                        <div className="address h-12 flex items-center p-4 gap-2">
                            <span className="text">Name: </span>

                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
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
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
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

                        <div className="w-full absolute bottom-2 flex justify-center">
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
                            <span className="text">Email: </span>
                            <span className="text">{user.email}</span> 
                        </div>
                        <div className="address h-10 flex items-center p-4 gap-2">
                            <span className="text">Name: </span>
                            <span className="text">{user.firstName} {user.lastName}</span> 
                        </div>
                    </div>
                }
            </div>
            <div className="address flex flex-col border w-5/10 rounded-md bg-gray-200  border-gray-400">
                <div className="title font-bold h-13 flex items-center border-b-1 border-gray-400 w-full p-4 flex justify-between">
                    <span>Address Book</span> 
                    {!addressEdit ? 
                        <BiSolidEdit onClick={() => {handleAddress(true)}} className="size-6 cursor-pointer"/> 
                        : 
                        <IoClose onClick={() => {handleAddress(false)}} className="size-6 cursor-pointer"/>
                    }
                </div>

                { addressEdit ?
                    <form onSubmit={(e) => handleSubmit(e, 'address')} className="edit relative w-full h-105 py-3 flex flex-col gap-4">
                        <div className="address h-12 flex items-center p-4 gap-2">
                            <span className="text">Name: </span>

                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
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
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
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

                        <div className="region h-10 flex items-center p-4 gap-2">
                            <span className="text">Region:</span> 
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.region ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
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
                        <div className="city h-10 flex items-center p-4 gap-2">
                            <span className="text">City:</span> 
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
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
                        <div className="address h-10 flex items-center p-4 gap-2">
                            <span className="text">Address: </span>
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
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
                        <div className="info h-10 flex items-center p-4 gap-2">
                            <span className="text">Additional info:</span>
                            <textarea
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.info ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                type="text" 
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
                        <div className="phone h-10 flex items-center p-4 gap-2">
                            <span className="text">Phone:</span>
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
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

                        <div className="w-full absolute bottom-2 flex justify-center">
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
                            <span className="text">{user.firstName} {user.lastName}</span> 
                        </div>
                        <div className="region h-10 flex items-center p-4 gap-2">
                            <span className="text">Region:</span> 
                            <span className="text">{user.address.region}</span> 
                        </div>
                        <div className="city h-10 flex items-center p-4 gap-2">
                            <span className="text">City:</span> 
                            <span className="text">{user.address.city}</span> 
                        </div>
                        <div className="address h-10 flex items-center p-4 gap-2">
                            <span className="text">Address: </span>
                            <span className="text">{user.address.address}</span> 
                        </div>
                        <div className="info h-10 flex items-center p-4 gap-2">
                            <span className="text">Additional info:</span>
                            <span className="text">{user.address.info}</span> 
                        </div>
                        <div className="phone h-10 flex items-center p-4 gap-2">
                            <span className="text">Phone:</span>
                            <span className="text">{user.address.mobile}</span> 
                        </div>
                    </div>

                }
                

            </div>
        </div>
    )
}

export default Account