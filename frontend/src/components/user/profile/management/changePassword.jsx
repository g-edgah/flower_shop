import { useState } from 'react'

import { useEditPassword } from '../../../../hooks/user/auth.js'

const ChangePassword = ({user, userRefetch, handleState}) => {
    const [ errors, setErrors ] = useState({})
    const [ currentPassword, setCurrentPassword ] = useState("")
    const [ showCurrentPassword, setShowCurrentPassword ] = useState(false)   
    const [ newPasswordOne, setNewPasswordOne ] = useState("")
    const [ showNewPasswordOne, setShowNewPasswordOne ] = useState(false)
    const [ newPasswordTwo, setNewPasswordTwo ] = useState("")
    const [ showNewPasswordTwo, setShowNewPasswordTwo ] = useState(false)

    const handleChange = (e) => {

        const { name, value } = e.target
        
        if (name === 'currentPassword') {
            setCurrentPassword(value)

        } else if (name === 'newPasswordOne') {
            setNewPasswordOne(value)

        } else if (name === 'newPasswordTwo') {
            setNewPasswordTwo(value)

        }
    }

    // validate change password form
    const validatePasswordChange = () => {
        const newErrors = {};



        if (newPasswordOne !== newPasswordTwo) {
            newErrors.newPasswordOne = 'Passwords do not match';
            newErrors.newPasswordTwo = 'Passwords do not match';
        } 

        if (!newPasswordOne) {
            newErrors.newPasswordTwo = 'Password is required';
            newErrors.currentPassword = '';
            newErrors.newPasswordOne = '';
        } 
        
        if (!newPasswordTwo && newPasswordOne) {
            newErrors.newPasswordTwo = 'Please confirm password';
            newErrors.newPasswordOne = '';
        } 

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$_#^!%*?&])[A-Za-z\d@$_#^!%*?&]{8,}$/;
        if (!passwordRegex.test(newPasswordOne)) {
            newErrors.newPasswordOne = 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character';
            newErrors.newPasswordTwo = '';
        }


        // confirm user has provided new password
        if (!newPasswordOne) {
            newErrors.newPasswordOne = 'Password is required';
            newErrors.newPasswordTwo = '';
        } 

        //confirm user has provided current password
        if (!currentPassword) {
            newErrors.currentPassword = 'Please provide the current password';
            newErrors.newPasswordTwo = '';
            newErrors.newPasswordOne = ''
        } 

           
        return newErrors;
    };

    const { mutate: editPassword, isLoading, error } = useEditPassword();

    const handleSubmit = (e) => {
        

        const validationErrors = validatePasswordChange();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            console.log("errors: ", errors)
            return;
        }
        //console.log("submitted change password")
        
        
        // api call
        editPassword({
            currentPassword: currentPassword,
            newPasswordOne: newPasswordOne,
            newPasswordTwo: newPasswordTwo
        }, {
            onSuccess: (data) => {
                console.log('Password change successful:', data);
                

                // store jwt
                if (data.token) {
                    console.log("token: ", data.token)
                    localStorage.setItem('token', data.token);
                    if (formData.rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                }

                handleState("none")

                
            },
            onError: (error) => {
                console.error('Password change failed:', error);
                // Handle specific error messages from API
                
                setErrors({ general: 'Password change failed. Please try again.' });
                
            }
        });
    }



    return (
        <div className="password">
            <div className="edit relative h-full py-4 flex flex-col gap-4 w-full">
                
                
                <div className="address flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Current Password: </span>

                    <div className="flex flex-col relative justify-between w-full max-w-70 gap-1">

                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type={showCurrentPassword ? 'text' : 'password'}
                            id='currentPassword' 
                            name='currentPassword'
                            value={currentPassword}
                            onChange={(e) => {handleChange(e)}}
                            placeholder="********"
                        />

                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute top-2.5 right-0 pr-3 flex items-center text-black cursor-pointer"
                        >
                            {!showCurrentPassword ? (
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


                        {errors?.currentPassword && (
                        <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
                        )} 

                        
                    </div>
                </div>

                <div className="address flex flex-col items-start px-4 gap-2 mt-5">
                    <span className="text font-semibold">New Password: </span>

                    <div className="relative flex flex-col justify-between w-full max-w-70 gap-1">

                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors.newPasswordOne ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type={showNewPasswordOne ? 'text' : 'password'}
                            id='newPasswordOne' 
                            name='newPasswordOne'
                            value={newPasswordOne}
                            onChange={(e) => {handleChange(e)}}
                            placeholder="********"
                        />

                        <button
                            type="button"
                            onClick={() => setShowNewPasswordOne(!showNewPasswordOne)}
                            className="absolute top-2.5 right-0 pr-3 flex items-center text-black cursor-pointer"
                        >
                            {!showNewPasswordOne ? (
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


                        {errors.newPasswordOne && (
                        <p className="mt-1 text-sm text-red-500">{errors.newPasswordOne}</p>
                        )} 
                    </div>
                </div>

                <div className="address flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Confirm New Password: </span>

                    <div className="relative flex flex-col justify-between w-full max-w-70 gap-1">

                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors.newPasswordTwo ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type={showNewPasswordTwo ? 'text' : 'password'}
                            id='newPasswordTwo' 
                            name='newPasswordTwo'
                            value={newPasswordTwo}
                            onChange={(e) => {handleChange(e)}}
                            placeholder="********"
                        />

                        <button
                            type="button"
                            onClick={() => setShowNewPasswordTwo(!showNewPasswordTwo)}
                            className="absolute top-2.5 right-0 pr-3 flex items-center text-black cursor-pointer"
                        >
                            {!showNewPasswordTwo ? (
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


                        {errors.newPasswordTwo && (
                        <p className="mt-1 text-sm text-red-500">{errors.newPasswordTwo}</p>
                        )} 
                    </div>
                </div>

                <div className="w-full mt-5 flex justify-center">
                    <button
                         onClick={(e) => handleSubmit(e)}
                        // disabled={isLoading}
                        className="w-30 mt-3 cursor-pointer bg-active text-white py-2 px-4 rounded-lg hover:bg-footer focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        submit
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

export default ChangePassword