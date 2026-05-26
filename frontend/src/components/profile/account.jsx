import { useState } from 'react'
import { BiSolidEdit } from "react-icons/bi";


const Account = ({ user }) => {
    const [ accountEdit, setAccountEdit ] = useState(false)
    const [ addressEdit, setAddressEdit ] = useState(false)


    const handleAccount = (state) => {
        setAccountEdit(state)
    }

    const handleAddress = (state) => {
        setAddressEdit(state)
    }

    const handleSubmit = () => {

    }



    return (
        <div className="flex p-4 justify-around w-full">
            <div className="account flex flex-col border w-78 rounded-md">
                <div className="title font-bold h-13 flex items-center border-b-1 w-full p-4 flex justify-between">
                    <span>Account Details</span> 
                    <BiSolidEdit className="size-6 cursor-pointer"/>
                </div>

                { accountEdit ?
                    <form onSubmit={handleSubmit} className="edit">
                        <div className="address h-10 flex items-center p-4 gap-2">
                            <span className="text">Email: </span>
                            <span className="text">{user.email}</span> 
                        </div>
                        <div className="address h-10 flex items-center p-4 gap-2">
                            <span className="text">Name: </span>
                            <span className="text">{user.firstName} {user.lastName}</span> 
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