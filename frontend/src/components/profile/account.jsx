import { BiSolidEdit } from "react-icons/bi";


const Account = () => {
    return (
        <div className="flex p-4 justify-around w-full">
            <div className="account flex flex-col border w-78 rounded-md">
                <div className="title font-bold h-13 flex items-center border-b-1 w-full p-4 flex justify-between">
                    <span>Account Details</span> 
                    <BiSolidEdit className="size-6 cursor-pointer"/>
                </div>
                <span className="email h-10 flex items-center p-4">boon@boon.com</span>
                <span className="name h-10 flex items-center p-4">boon boon</span>
            </div>
            <div className="address flex flex-col border w-78 rounded-md">
                <div className="title font-bold h-13 flex items-center border-b-1 w-full p-4 flex justify-between">
                    <span>Address Book</span> 
                    <BiSolidEdit className="size-6 cursor-pointer"/>
                </div>
                <span className="name h-10 flex items-center p-4 ">booon boon</span>
                <span className="region h-10 flex items-center p-4 ">Region: Nairobi</span>
                <span className="city h-10 flex items-center p-4 ">City: Kahawa West</span>
                <span className="address h-10 flex items-center p-4 ">Address: UoN</span>
                <span className="info h-10 flex items-center p-4 ">Additional info: Mess</span>
                <span className="phone h-10 flex items-center p-4 ">phone: +254712345678</span>

            </div>
        </div>
    )
}

export default Account