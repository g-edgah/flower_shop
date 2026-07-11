import { FaArrowLeft } from "react-icons/fa6";
import {useEffect} from 'react'

const AddMobile = ({handleSubmit, handleMobileChange, newMobile, mobileErrors, setMobileErrors, setNewState, setNewMobile}) => {

    useEffect(() => {
        setNewMobile({
            firstName: '',
            lastName: '',
            phoneNumber: '',
            provider: ''
        })
        setMobileErrors({})
    },[])

    return (
        <div className="p-3 flex flex-col gap-5">
            <div className="title flex gap-3 border-b border-gray-300 w-10/10 p-3">
                <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" 
                onClick={() => {
                    setNewState("none")
                    setNewMobile({
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        provider: ''
                    })
                    setMobileErrors({})
                }} />
                <span className="title text-xl font-bold">Add mobile money Account</span>
            </div>

            <form className="flex flex-col gap-7 py-5 px-5" onSubmit={(e) => handleSubmit(e, 'mobile')}>
                <div className="relative flex flex-col justify-between w-full max-w-90 gap-2">
                    <span className="text-[16px] font-semibold">Name: </span>

                    <div className="flex justify-between w-full gap-4">
                    
                    <div className="flex flex-col">
                    <input 
                        className={`w-full pl-4 pr-2 py-1.5 border ${mobileErrors?.firstName ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition'} rounded-lg bg-gray-100`}
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
                        className={`w-full pl-4 pr-2 py-1.5 border ${mobileErrors?.lastName ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition'} rounded-lg bg-gray-100`}
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

                    <span className="text-[16px] font-semibold">Phone Number: </span>
                    <div className="flex items-start gap-1">

                        <span className="text font-semibold  border-gray-300 rounded-lg py-1.5 px-1.5">
                            +254
                        </span>
                        <div className="flex flex-col">
                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${mobileErrors?.phoneNumber ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition'} rounded-lg bg-gray-100`}
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
                        <span className="text-[16px] font-semibold">Provider: </span>
                        <div className="flex flex-col">
                        <div className="cont flex gap-3">

                            <div onClick ={()=>{setNewMobile({
                                ...newMobile,
                                provider: 'mpesa'
                            })}} 
                            className={`mpesa cursor-pointer bg-[url(/logos/mpesa1.png)] bg-no-repeat bg-center w-15 h-9 bg-white bg-size-[auto_33px] rounded-md border border-gray-400 ${newMobile?.provider ==='mpesa' ? 'outline-[2px] outline-offset-1 outline-active ':''}`}>

                            </div>

                            <div onClick ={()=>{
                                setNewMobile({
                                    ...newMobile,
                                    provider: 'airtel'
                                })
                                setMobileErrors({
                                    ...mobileErrors,
                                    provider: ''
                                })}} 
                            className={`airtel cursor-pointer bg-[url(/logos/airtel1.png)] bg-no-repeat bg-center w-15 h-9 bg-size-[auto_29px] border bg-white border-gray-400 rounded-md ${newMobile?.provider ==='airtel' ? 'outline-[2px] outline-offset-1 outline-active ':''}`}>

                            </div>

                            <div onClick ={()=>{
                                setNewMobile({
                                    ...newMobile,
                                    provider: 'tkash'
                                })
                                setMobileErrors({
                                    ...mobileErrors,
                                    provider: ''
                                })}} 
                            className={`tkash cursor-pointer bg-[url(/logos/telkom.png)] bg-no-repeat bg-center w-15 h-9 bg-[#00AACA] bg-size-[auto_17px] border border-gray-400 rounded-md ${newMobile?.provider ==='tkash' ? 'outline-[2px] outline-offset-1 outline-active ':''}`}>

                            </div>


                        </div>


                    
                        {mobileErrors?.provider && (
                        <p className="mt-1 text-sm text-red-500">{mobileErrors?.provider}</p>
                        )} 
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-center mt-4">

                    <button type='submit' className='bg-active text-white p-2 rounded-md w-35'>Add Mobile</button>
                </div>
            </form>
        
        </div>
    )
}

export default AddMobile