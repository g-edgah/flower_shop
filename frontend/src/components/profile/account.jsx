import { useState } from 'react'
import { BiSolidEdit } from "react-icons/bi";
import axios from 'axios'

import { useEditUser } from '../../hooks/user.js';


const Account = ({ user }) => {
    const [ accountEdit, setAccountEdit ] = useState(false)
    const [ addressEdit, setAddressEdit ] = useState(false)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        mobile: user.mobile,
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
        setFormData({
        ...formData,
        [name]: value,
        });

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
        
        
        if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (formData.confirmPassword.length < 6) {
        newErrors.confirmPassword = 'Password must be at least 6 characters';
        }


        if (formData.newPassword !== formData.confirmPassword) {
        newErrors.newPassword = 'Passwords do not match';
        newErrors.confirmPassword = 'Passwords do not match';
        } 


        if (!formData.newPassword) {
        newErrors.newPassword = 'Password is required';
        newErrors.confirmPassword = '';

        } 
        if (!formData.confirmPassword && formData.newPassword) {
        newErrors.confirmPassword = 'Please confirm password';
        newErrors.newPassword = '';
        } 

        if (!formData.email) {
        newErrors.email = 'Email is required';
        newErrors.confirmPassword = '';
        newErrors.newPassword = '';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        newErrors.confirmPassword = '';
        newErrors.newPassword = '';
        }
           
        
        return newErrors;
    };


    
    // api call
        const { mutate: editUser, isLoading, error, data } = useEditUser();

    //form submission
    const handleSubmit = async (e) => {
        e.preventDefault();



        console.log(formData.newPassword)
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        editUser(userId,formData, {
            onSuccess: (data) => {
                console.log('Registration successfull!', data)

                // Redirect or update auth state
                navigate('/login');
            },
            onError: (error) => {
                console.error('Registration failed: ', error)
                alert('Registration failed. Please try again.')
            }
        })

        setAccountEdit(false)
    };




    return (
        <div className="flex p-4 justify-around w-full">
            <div className="account flex flex-col border w-78 rounded-md">
                <div className="title font-bold h-13 flex items-center border-b-1 w-full p-4 flex justify-between">
                    <span>Account Details</span> 
                    {!accountEdit && <BiSolidEdit onClick={() => {handleAccount(true)}} className="size-6 cursor-pointer"/>}
                </div>

                { accountEdit ?
                    <form onSubmit={handleSubmit} className="edit pt-3 flex flex-col gap-2">
                        <div className="address h-10 flex items-center p-4 gap-2">
                            <span className="text">Email: </span>
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                type="email" 
                                id='email' 
                                name='email'
                                value={formData.email}
                                onChange={(e) => {handleChange(e)}}
                                placeholder={user.email}
                            />
                            {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )} 
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

                        <div className="w-full flex justify-center">
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
            <div className="address flex flex-col border w-78 rounded-md">
                <div className="title font-bold h-13 flex items-center border-b-1 w-full p-4 flex justify-between">
                    <span>Address Book</span> 
                    <BiSolidEdit className="size-6 cursor-pointer"/>
                </div>

                { addressEdit ?
                    <form action="" className="account">
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