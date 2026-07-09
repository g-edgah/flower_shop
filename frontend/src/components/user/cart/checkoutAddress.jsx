import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const CheckoutAddress = ({ addressEdit, handleAddress, handleSubmit, errors, formData, user, isLoading }) => {


    return (
        <div className="delivery bg-gray-200 w-9/10  rounded-lg p-3">
            <div className="address flex flex-col  w-full rounded-md">
            <div className="title font-bold h-13 flex items-center border-b border-gray-400 w-full p-4 justify-between ">
                <span>Delivery Information</span> 
                {!addressEdit ? 
                    <BiSolidEdit onClick={() => {handleAddress(true)}} className="size-6 cursor-pointer text-summaryButtons"/> 
                    : 
                    <IoClose onClick={() => {handleAddress(false)}} className="size-6 cursor-pointer text-summaryButtons"/>
                }
            </div>

            { addressEdit ?
                <form onSubmit={(e) => handleSubmit(e)} className="edit relative w-full h-auto py-3 flex flex-col gap-6">
                    <div className="address flex flex-col items-start justify-center px-4 space-y-3">
                        <span className="text pl-1 font-bold">Name: </span>
                        <div className="flex flex-row gap-4 w-full">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors?.firstName ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                type="text" 
                                id='firstName' 
                                name='firstName'
                                value={formData?.firstName}
                                onChange={(e) => {handleChange(e)}}
                                placeholder={user?.firstName}
                            />
                            {errors?.firstName && (
                            <p className="mt-1 text-sm text-red-500">{errors?.firstName}</p>
                            )} 

                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors?.lastName ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                                type="text" 
                                id='lastName' 
                                name='lastName'
                                value={formData?.lastName}
                                onChange={(e) => {handleChange(e)}}
                                placeholder={user?.lastName}
                            />
                            {errors?.lastName && (
                            <p className="mt-1 text-sm text-red-500">{errors?.lastName}</p>
                            )} 
                        </div>
                    </div>

                    <div className="region flex flex-col items-start justify-center px-4 space-y-3">
                        <span className="text pl-1 font-bold">Region:</span> 
                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors?.region ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type="text" 
                            id='region' 
                            name='address.region'
                            value={formData?.address?.region}
                            onChange={(e) => {handleChange(e)}}
                            placeholder={user?.address?.region}
                        />
                        {errors?.region && (
                        <p className="mt-1 text-sm text-red-500">{errors?.region}</p>
                        )} 
                    </div>
                    <div className="city flex flex-col items-start justify-center px-4 space-y-3">
                        <span className="text pl-1 font-bold">City:</span> 
                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors?.city ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type="text" 
                            id='city' 
                            name='address.city'
                            value={formData?.address.city}
                            onChange={(e) => {handleChange(e)}}
                            placeholder={user?.address?.city}
                        />
                        {errors?.city && (
                        <p className="mt-1 text-sm text-red-500">{errors?.city}</p>
                        )} 
                    </div>
                    <div className="address flex flex-col items-start justify-center px-4 space-y-3">
                        <span className="text pl-1 font-bold">Address: </span>
                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors?.address ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type="text" 
                            id='address' 
                            name='address.address'
                            value={formData?.address?.address}
                            onChange={(e) => {handleChange(e)}}
                            placeholder={user?.address?.address}
                        />
                        {errors?.address && (
                        <p className="mt-1 text-sm text-red-500">{errors?.address}</p>
                        )} 
                    
                    </div>
                    <div className="info flex flex-col items-start justify-center px-4 space-y-3">
                        <span className="text w-35 pl-1 font-bold">Additional info:</span>
                        <textarea 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors?.info ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type="textarea" 
                            id='info' 
                            name='address.info'
                            value={formData?.address?.info}
                            onChange={(e) => {handleChange(e)}}
                            placeholder={user?.address?.info}
                        />
                        {errors?.info && (
                        <p className="mt-1 text-sm text-red-500">{errors?.info}</p>
                        )} 
                    </div>
                    <div className="phone flex flex-col items-start justify-center px-4 space-y-3">
                        <span className="text pl-1 font-bold">Phone:</span>
                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors?.mobile ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                            type="text" 
                            id='mobile' 
                            name='address.mobile'
                            value={formData?.address?.mobile}
                            onChange={(e) => {handleChange(e)}}
                            placeholder={user?.address?.mobile}
                        />
                        {errors?.mobile && (
                        <p className="mt-1 text-sm text-red-500">{errors?.mobile}</p>
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
                        <span className="text font-bold">{user?.firstName} {user?.lastName}</span> 
                    </div>
                    <div className="region h-10 flex items-center p-4 gap-2">
                        <span className="text">Region:</span> 
                        <span className="text font-bold">{user?.address?.region}</span> 
                    </div>
                    <div className="city h-10 flex items-center p-4 gap-2">
                        <span className="text">City:</span> 
                        <span className="text font-bold">{user?.address?.city}</span> 
                    </div>
                    <div className="address h-10 flex items-center p-4 gap-2">
                        <span className="text">Address: </span>
                        <span className="text font-bold">{user?.address?.address}</span> 
                    </div>
                    <div className="info h-10 flex items-center p-4 gap-2">
                        <span className="text">Additional info:</span>
                        <span className="text font-bold">{user?.address?.info}</span> 
                    </div>
                    <div className="phone h-10 flex items-center p-4 gap-2">
                        <span className="text">Phone:</span>
                        <span className="text font-bold">{user?.address?.mobile}</span> 
                    </div>
                </div>

            }
            

        </div>

        </div>
    )
}

export default CheckoutAddress