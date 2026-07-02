import { useState } from 'react'

import { FaArrowLeft } from "react-icons/fa6";

import ChangePassword from './changePassword.jsx'
import ChangeEmail from './changeEmail.jsx'
import DeleteAccount from './deleteAccount.jsx'


const Management = ({ userRefetch, user }) => {
    const [ state, setState ] = useState("none")
    

    const handleState = (currentState) => {
        setState(currentState)
    }

    

    // validate email change form
    const validateEmailChange = () => {
        const newErrors = {};

        //confirm user has provided current password
        if (!currentPassword) {
        newErrors.currentPassword = 'Please provide the current password';
        newErrors.newPasswordTwo = '';
        newErrors.newPasswordOne = ''
        } 

        if (newPasswordOne.length < 6) {
        newErrors.newPasswordOne = 'Password must be at least 6 characters';
        newErrors.currentPassword = '';
        newErrors.newPasswordTwo = '';
        }


        if (!email) {
        newErrors.email = 'Email is required';
        newErrors.confirmPassword = '';
        newErrors.password = '';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        newErrors.confirmPassword = '';
        newErrors.password = '';
        }
           
        
        return newErrors;
    };

    const handleSubmitEmail = () => {

    }


    return (
        <div className=''>
            
            {state ==='none' && (
                <div className="p-3 flex flex-col gap-5">
                    <div className="title border-b border-gray-300 w-10/10 p-3">
                        <span className="title text-xl font-bold ">Account Management</span>
                    </div>
                    <div className="pass flex flex-col gap-4 pt-5 pb-15 items-center">
                        <button onClick={()=>{handleState("password")}} className="text cursor-pointer hover:bg-gray-400 bg-gray-300 h-10 rounded-md flex items-center justify-center w-50">change password</button>
                        <button onClick={()=>{handleState("email")}} className="text cursor-pointer bg-gray-300 hover:bg-gray-400 h-10 rounded-md flex items-center justify-center w-50">change email</button>
                        <button onClick={()=>{handleState("delete")}} className="text cursor-pointer bg-red-500 hover:bg-red-600 h-10 rounded-md flex items-center justify-center w-50">Delete Account</button>
                    </div>
                </div>
            )}
            {state === 'password' && (
                <div className="pass p-3 flex flex-col gap-5">
                    <div className="title flex gap-5 items-center border-b border-gray-300 w-full p-3">
                        <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" onClick={() => setState("none")} />
                        <span className="title text-xl font-bold ">Change Password</span>
                
                    </div>
                    <ChangePassword user={user} userRefetch={userRefetch} handleState={handleState} />
                </div>
            )}
            {state === 'email' && (
                <div className="email p-3 flex flex-col gap-5">
                    <div className="title flex gap-5 items-center border-b border-gray-300 w-full p-3">
                        <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" onClick={() => setState("none")} />
                        <span className="title text-xl font-bold ">Change Email</span>
                
                    </div>
                
                    <ChangeEmail user={user} userRefetch={userRefetch} handleState={handleState} />
                </div>
            )}
            {state === 'delete' && (
                <div className="p-3 flex flex-col gap-5">
                    <div className="title flex gap-5 items-center border-b border-gray-300 w-full p-3">
                        <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" onClick={() => setState("none")} />
                        <span className="title text-xl font-bold ">Delete Acccount</span>
                
                    </div>
                    <DeleteAccount user={user} userRefetch={userRefetch} handleState={handleState} />
                </div>
            )}
            
        </div>
    )
}

export default Management