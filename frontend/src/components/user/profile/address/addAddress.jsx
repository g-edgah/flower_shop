

const AddAddress  = ({ handleSubmit, handleChange, formData, errors, citiesData, regionsData, getCitiesLoading, getRegionsLoading }) => {

return (
    <div className="flex justify-between gap-3 pb-5">
        <div className="address flex flex-col w-full rounded-md">
            
            <form onSubmit={(e) => handleSubmit(e, 'address')} className="edit relative w-full  flex flex-col gap-7 py-5 px-5">
                <div className="address flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Name: </span>

                    <div className="flex justify-between w-full gap-4">

                        <div className="flex flex-col">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                                type="text" 
                                id='firstName' 
                                name='firstName'
                                value={formData.firstName}
                                onChange={(e) => {handleChange(e)}}
                                placeholder="Jane"
                            />
                            {errors.firstName && (
                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                            )} 
                        </div>

                        <div className="flex flex-col">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                                type="text" 
                                id='lastName' 
                                name='lastName'
                                value={formData.lastName}
                                onChange={(e) => {handleChange(e)}}
                                placeholder="Doe"
                            />
                            {errors.lastName && (
                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                            )} 
                        </div>
                    </div>
                </div>

                <div className="flex w-full px-4 gap-4">
                    <div className="min-w-35 w-4/10 region flex flex-col items-start gap-2">
                        <span className="text font-semibold">Region:</span>
                        <div className="flex flex-col">
                            <select
                                className={`w-full pl-4 pr-2 py-2 border ${errors.region ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                                id='region'
                                name='region'
                                value={formData.address.region}
                                onChange={(e) => handleChange(e)}
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
                            {errors.region && (
                                <p className="mt-1 text-sm text-red-500">{errors.region}</p>
                            )}
                        </div>
                    </div>
                    <div className="region flex flex-col items-start gap-2 min-w-40 w-6/10">
                        <span className="text font-semibold">City:</span> 
                        <div className="flex flex-col">
                            <select
                                className={`w-full pl-4 pr-2 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100 pr-3`}
                                id='city'
                                name='city'
                                value={formData.address.city}
                                onChange={(e) => handleChange(e)}
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
                            {errors.city && (
                                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="address flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Address: </span>
                    <div className="flex flex-col">
                        <input 
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors.address ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                            type="text" 
                            id='address' 
                            name='address'
                            value={formData.address.address}
                            onChange={(e) => {handleChange(e)}}
                            placeholder="Address"
                        />
                        {errors.address && (
                        <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                        )} 
                    </div>
                
                </div>
                <div className="info flex flex-col items-start px-4 gap-2">
                    <span className="text font-semibold">Additional info:</span>
                    <div className="flex flex-col">
                        <textarea
                            className={`w-full pl-4 pr-2 py-1.5 border ${errors.info ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition bg-gray-100`}
                            type="text" 
                            id='info' 
                            name='info'
                            value={formData.address.info}
                            onChange={(e) => {handleChange(e)}}
                            placeholder="Additional info e.g building"
                        />
                        {errors.info && (
                        <p className="mt-1 text-sm text-red-500">{errors.info}</p>
                        )} 
                    </div>
                </div>
                <div className="phone flex flex-col items-start px-4 gap-2 mb-16">
                    <span className="text font-semibold">Phone Number:</span>
                    <div className="flex items-start gap-1">

                        <span className="text font-semibold  border-gray-300 rounded-lg py-1.5 px-1.5">
                            +254
                        </span>
                        <div className="flex flex-col">
                            <input 
                                className={`w-full pl-4 pr-2 py-1.5 border ${errors?.phoneNumber ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition' : 'border-gray-400 focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition'} rounded-lg bg-gray-100`}
                                type='text'
                                id='phoneNumber' 
                                name='phoneNumber'
                                value={formData?.phoneNumber}
                                onChange={(e) => {handleMobileChange(e)}}
                                placeholder="0712345678"
                            />


                            {errors?.phoneNumber && (
                            <p className="mt-1 text-sm text-red-500">{errors?.phoneNumber}</p>
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

export default AddAddress