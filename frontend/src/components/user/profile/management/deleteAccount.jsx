import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useDeleteAccount } from '../../../../hooks/user/auth.js'

const DeleteAccount = ({user, userRefetch, handleState, state}) => {
    const navigate = useNavigate()
    const queryClient = useQueryClient();


    const [ errors, setErrors ] = useState({})
    const [ password, setPassword ] = useState("")
    const [ showPassword, setShowPassword ] = useState("")
    const [ reason, setReason ] = useState("")
    
    useEffect(() => {
        setPassword("")
        setReason("")
        setErrors({})
    }, [state])

    const handleChange = (e) => {

        const { name, value } = e.target
        
        if (name === 'password') {
            setPassword(value)

        } else if (name === 'reason') {
            setReason(value)

        }
    }

    // validate change email form
    const validateDelete = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = 'Password is required';
        }

        // if (!reason) {
        //     newErrors.reason = 'Reason is required';
        // }
           
        return newErrors;
    };

    const { mutate: deleteAccount, isLoading, error } = useDeleteAccount();

    const handleSubmit = (e) => {
        
        const validationErrors = validateDelete();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("errors: ", errors)
            return;
        }
        //console.log("submitted change email")
        
        
        // api call
        deleteAccount({
            password: password,
            reason: reason
        }, {
            onSuccess: (data) => {
                console.log('Account deletion successful:', data);

                setPassword("")
                setReason("")

                setErrors({})

                toast.dismiss();
                toast.success('Account deleted successfully!', {
                    className: 'custom-toast--success',
                });

                //clear all cached data
                queryClient.clear();

                localStorage.removeItem('rememberMe');
                localStorage.removeItem('userId');

                handleState("none")

                userRefetch()

                navigate('/')
            },
            onError: (error, ) => {
                //console.error('Account deletion failed:', error.response?.data);

                // handle specific error messages from API
                const errorData = error.response?.data;

                toast.dismiss();
                toast.error('Account deletion failed!', {
                    className: 'custom-toast--error',
                });
                
                if (errorData?.errorType === 'password') {
                    setErrors({ password: errorData?.error || 'Incorrect password' });
                } else if (errorData?.errorType === 'reason') {
                    setErrors({ reason: errorData?.error || 'Invalid reason' });
                } else {
                    setErrors({ general: 'Account deletion failed. Please try again.' });
                }
                
            }
        });
    }



    return (
        <div className="password">
            <div className="edit relative h-full py-4 flex flex-col gap-4 w-full">
                
                
                <div className="address flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Password: </span>

                    <div className="flex flex-col relative justify-between w-full max-w-70 gap-1">

                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type={showPassword ? 'text' : 'password'}
                            id='password' 
                            name='password'
                            value={password}
                            onChange={(e) => {handleChange(e)}}
                            placeholder="********"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-2.5 right-0 pr-3 flex items-center text-black cursor-pointer"
                        >
                            {!showPassword ? (
                            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            )}
                        </button>


                        {errors?.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                        )} 

                        
                    </div>
                </div>

                <div className="address flex flex-col items-start px-4 gap-2 mt-5">
                    <span className="text font-semibold">Mind telling us why? (optional): </span>

                    <div className="relative flex flex-col justify-between w-full max-w-70 gap-1">

                        <textarea 
                            className={`w-full h-50 pl-4 pr-2 py-1.5 border ${errors.reason ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type='text'
                            id='reason' 
                            name='reason'
                            value={reason}
                            onChange={(e) => {handleChange(e)}}
                            placeholder="Please tell us why you want to delete your account"
                        />


                        {errors.reason && (
                        <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
                        )} 
                    </div>
                </div>

               

                <div className="w-full mt-5 flex justify-center">
                    <button
                         onClick={(e) => handleSubmit(e)}
                        // disabled={isLoading}
                        className="w-40 mt-3 cursor-pointer bg-active text-white py-2 px-4 rounded-lg hover:bg-footer focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        Delete Account
                        {/* {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                        </div>
                        ) : (
                        'Submit'
                        )} */}
                    </button>
                </div>
            </div>

        </div>   

    )

}

export default DeleteAccount