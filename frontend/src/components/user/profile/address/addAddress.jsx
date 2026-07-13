

const AddAddress  = () => {

return (
    <div className="address flex flex-col border w-full rounded-md bg-gray-200  border-gray-400">
        <div className="title font-bold h-13 flex items-center border-b border-gray-400 w-full p-4 justify-between">
            <span>Add New Address</span> 
            
        </div>

        
        <form onSubmit={(e) => handleSubmit(e, 'address')} className="edit relative w-full  py-3 flex flex-col gap-4">
            <div className="address flex flex-col items-start px-4 gap-2">
                <span className="text font-semibold">Name: </span>

                <div className="flex justify-between w-full gap-4">

                    <input 
                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                        type="text" 
                        id='firstName' 
                        name='firstName'
                        value={formData.firstName}
                        onChange={(e) => {handleChange(e)}}
                        placeholder={user?.firstName}
                    />
                    {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )} 

                    <input 
                        className={`w-full pl-4 pr-2 py-1.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                        type="text" 
                        id='lastName' 
                        name='lastName'
                        value={formData.lastName}
                        onChange={(e) => {handleChange(e)}}
                        placeholder={user?.lastName}
                    />
                    {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )} 
                </div>
            </div>

            <div className="region flex flex-col items-start px-4 gap-2">
                <span className="text font-semibold">Region:</span> 
                <input 
                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.region ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                    type="text" 
                    id='region' 
                    name='address.region'
                    value={formData.address.region}
                    onChange={(e) => {handleChange(e)}}
                    placeholder={user?.address?.region}
                />
                {errors.region && (
                <p className="mt-1 text-sm text-red-500">{errors.region}</p>
                )} 
            </div>
            <div className="city flex flex-col items-start px-4 gap-2">
                <span className="text font-semibold">City:</span> 
                <input 
                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.city ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                    type="text" 
                    id='city' 
                    name='address.city'
                    value={formData.address.city}
                    onChange={(e) => {handleChange(e)}}
                    placeholder={user?.address?.city}
                />
                {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )} 
            </div>
            <div className="address flex flex-col items-start px-4 gap-2">
                <span className="text font-semibold">Address: </span>
                <input 
                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.address ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                    type="text" 
                    id='address' 
                    name='address.address'
                    value={formData.address.address}
                    onChange={(e) => {handleChange(e)}}
                    placeholder={user?.address?.address}
                />
                {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )} 
            
            </div>
            <div className="info flex flex-col items-start px-4 gap-2">
                <span className="text font-semibold">Additional info:</span>
                <textarea
                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.info ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                    type="text" 
                    id='info' 
                    name='address.info'
                    value={formData.address.info}
                    onChange={(e) => {handleChange(e)}}
                    placeholder={user?.address?.info}
                />
                {errors.info && (
                <p className="mt-1 text-sm text-red-500">{errors.info}</p>
                )} 
            </div>
            <div className="phone flex flex-col items-start px-4 gap-2 mb-16">
                <span className="text font-semibold">Phone:</span>
                <input 
                    className={`w-full pl-4 pr-2 py-1.5 border ${errors.mobile ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                    type="text" 
                    id='mobile' 
                    name='address.mobile'
                    value={formData.address.mobile}
                    onChange={(e) => {handleChange(e)}}
                    placeholder={user?.address?.mobile}
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
                        Saving...
                    </div>
                    ) : (
                    'Save'
                    )}
                </button>
            </div>
        </form>
    </div>
)
}

export default AddAddress