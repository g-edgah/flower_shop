

const NewAddressPage  = ({  handleNewSubmit, handleNewChange,  newAddress, newErrors, citiesData, regionsData, getCitiesLoading, getRegionsLoading }) => {

return (
    <div className="flex justify-between gap-3 pb-5">
        <div className="address flex flex-col w-full rounded-md">
            
            <form onSubmit={(e) =>  handleNewSubmit(e, 'address')} className="edit relative w-full  flex flex-col gap-7 py-5 px-5">
                <div className="address flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Name: </span>

                    <div className="flex justify-between w-full gap-4">

                        <div className="flex flex-col w-full">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${newErrors.firstName ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar'} rounded-lg  bg-gray-100  transition`}
                                type="text" 
                                id='firstName' 
                                name='firstName'
                                value={ newAddress.firstName}
                                onChange={(e) => {handleNewChange(e)}}
                                placeholder="Jane"
                            />
                            {newErrors.firstName && (
                            <p className="mt-1 text-sm text-red-500">{newErrors.firstName}</p>
                            )} 
                        </div>

                        <div className="flex flex-col w-full">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${newErrors.lastName ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar'} rounded-lg bg-gray-100`}
                                type="text" 
                                id='lastName' 
                                name='lastName'
                                value={ newAddress.lastName}
                                onChange={(e) => {handleNewChange(e)}}
                                placeholder="Doe"
                            />
                            {newErrors.lastName && (
                            <p className="mt-1 text-sm text-red-500">{newErrors.lastName}</p>
                            )} 
                        </div>
                    </div>
                </div>

                <div className="flex w-full px-4 gap-4">
                    <div className="min-w-35 w-4/10 region flex flex-col items-start gap-2">
                        <span className="text font-semibold">Region:</span>
                        <div className="flex flex-col w-full">
                            <select
                                className={`w-full pl-4 pr-2 py-2 border ${newErrors.region ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar'} rounded-lg bg-gray-100`}
                                id='region'
                                name='region'
                                value={ newAddress.region}
                                onChange={(e) => handleNewChange(e)}
                                disabled={regionsData?.isLoading}
                            >
                                <option value="">
                                    {getRegionsLoading ? 'Loading regions...' : 'Select Region'}
                                </option>
                                {regionsData?.data?.regions.map((region) => (
                                    <option key={region.id || region} value={region.name || region}>
                                        {region.name || region}
                                    </option>
                                ))}
                            </select>
                            {newErrors.region && (
                                <p className="mt-1 text-sm text-red-500">{newErrors.region}</p>
                            )}
                        </div>
                    </div>
                    <div className="region flex flex-col items-start gap-2 min-w-40 w-6/10">
                        <span className="text font-semibold">City:</span> 
                        <div className="flex flex-col w-full">
                            <select
                                className={`w-full pl-4 pr-2 py-2 border ${newErrors.city ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar'}  rounded-lg bg-gray-100 pr-3`}
                                id='city'
                                name='city'
                                value={ newAddress.city}
                                onChange={(e) => handleNewChange(e)}
                                disabled={citiesData?.isLoading}
                            >
                                <option value="">
                                    {getCitiesLoading ? 'Loading Cities...' : 'Select City'}
                                </option>
                                {citiesData?.data?.cities.map((city) => (
                                    <option key={city.id || city} value={city.name || city}>
                                        {city.name || city}
                                    </option>
                                ))}
                            </select>
                            {newErrors.city && (
                                <p className="mt-1 text-sm text-red-500">{newErrors.city}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="address flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Address: </span>
                    <div className="flex flex-col w-full">
                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${newErrors.address ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar'}  rounded-lg bg-gray-100`}
                            type="text" 
                            id='address' 
                            name='address'
                            value={ newAddress?.address}
                            onChange={(e) => {handleNewChange(e)}}
                            placeholder="Address"
                        />
                        {newErrors?.address && (
                        <p className="mt-1 text-sm text-red-500">{newErrors?.address}</p>
                        )} 
                    </div>
                
                </div>
                <div className="info flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Additional info:</span>
                    <div className="flex flex-col w-full">
                        <textarea
                            className={`w-full pl-4 pr-2 py-1.5 border ${newErrors.info ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar'}  rounded-lg bg-gray-100`}
                            type="text" 
                            id='info' 
                            name='info'
                            value={ newAddress?.info}
                            onChange={(e) => {handleNewChange(e)}}
                            placeholder="Additional info e.g building"
                        />
                        {newErrors.info && (
                        <p className="mt-1 text-sm text-red-500">{newErrors.info}</p>
                        )} 
                    </div>
                </div>
                <div className="phone flex flex-col items-start px-4 gap-2 mb-16">
                    <span className="text font-semibold">Phone Number:</span>
                    <div className="flex items-start gap-1">

                        <span className="text font-semibold  border-gray-300 rounded-lg py-1.5 px-1.5">
                            +254
                        </span>
                        <div className="flex flex-col w-full">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${newErrors?.phoneNumber ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition'} rounded-lg bg-gray-100`}
                                type='text'
                                id='phoneNumber' 
                                name='phoneNumber'
                                value={ newAddress?.phoneNumber}
                                onChange={(e) => {handleNewChange(e)}}
                                placeholder="0712345678"
                            />


                            {newErrors?.phoneNumber && (
                            <p className="mt-1 text-sm text-red-500">{newErrors?.phoneNumber}</p>
                            )} 
                        </div>
                    </div>
                </div>

                <div className="w-full absolute bottom-2 flex justify-center">
                    <button
                        type="submit"
                        className="w-30 mt-3 cursor-pointer bg-active text-white py-2 px-4 rounded-lg hover:bg-footer focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        
                        Save
                        
                    </button>
                </div>
            </form>
        </div>
    </div>
)
}

export default NewAddressPage