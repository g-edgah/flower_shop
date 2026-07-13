import { useState, useEffect } from 'react'
import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import axios from 'axios'
import { FaPlus, FaArrowLeft } from "react-icons/fa6";
import { toast } from 'react-toastify';

import { useGetUserAddresses, useAddAddress, useRemoveAddress, useUpdateAddress, useEditDefaultAddress, useGetRegions, useGetCities } from '../../../../hooks/user/user.js';

import AddAddress from './addAddress.jsx'
import AddressCard from './addressCard.jsx'


const Address = ({userRefetch, user}) => {
    const [ addressState, setAddressState ] = useState('addresses') 
    const [ addressEdit, setAddressEdit ] = useState(false)
    const [errors, setErrors] = useState({})

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        country: "",
        region: "",
        city: "",
        address: "",
        info: "",
        mobile: ""
    });


    

    // handle input
    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prevData => ({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        if (name == 'address.region'){
            console.log("region change: ", value)
           
        }
       

        // clear error for this field when user starts typing
        if (errors[name]) {
        setErrors({
            ...errors,
            [name]: '',
        });
        }
    };


    

    //get regions
    const { data: regionsData, isLoading: getRegionsLoading, error: getRegionsError, isFetching: getRegionsFetching, refetch: getRegionsRefetch } = useGetRegions();
    
    //get cities
    const { data: citiesData, isLoading: getCitiesLoading, error: getCitiesError, isFetching: getCitiesFetching, refetch: getCitiesRefetch } = useGetCities(formData.address.region);

    //get user addresses
    const { data: getAddressesData, isLoading: getAddressesLoading, error: getAddressesesError, isFetching: getAddressesFetching, refetch: getAddressesRefetch } = useGetUserAddresses();
   
    // add address
    const { mutate: addAddress, isLoading: addAddressLoading, error: addAddressError, data: addAddressData } = useAddAddress();

    // remove address
    const { mutate: removeAddress, isLoading: removeAddressLoading, error: removeAddressError, data: removeAddressData } = useRemoveAddress();

    // update address
    const { mutate: updateAddress, isLoading: updateAddressLoading, error: updateAddressError, data: updateAddressData } = useUpdateAddress();



    // validate form
    const validateForm = () => {
        const newErrors = {};
        
        
        // if (formData.firstName.length < 1) {
        // newErrors.newPassword = 'Password must be at least 6 characters';
        // }
        

        // if (formData.email) {
        // !/\S+@\S+\.\S+/.test(formData.email)
        // newErrors.email = 'Email is invalid';
        // }
           
        
        return newErrors;
    };



    // form submission
    const handleSubmit = async (e, type) => {
        e.preventDefault();
        console.log("e: ",e)



        console.log(formData)
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        editUser(formData, {
            onSuccess: (data) => {
                console.log('Edit successfull!', data)
                userRefetch()
                
            },
            onError: (error) => {
                console.error('Edit failed: ', error)
                alert('Edit failed. Please try again.')
                if (type === 'account') {
                    setAccountEdit(true)
                } else if (type === 'address') {
                    setAddressEdit(true)
                }
               
            }
        })

        if (type === 'account') {
            setAccountEdit(false)
        } else if (type === 'address') {
            setAddressEdit(false)
        }
               
    };




    return (
        <div className="flex flex-col justify-around w-full">
            
                <div className='p-3 flex flex-col gap-5'>
                    {(addressState === 'addresses') ?
                    <div className="title border-b border-gray-300 w-10/10 p-3">
                        <span className="title text-xl font-bold ">Address Book</span>
                    </div> 
                    : 
                    <div className="title border-b border-gray-300 w-10/10 p-3 flex gap-2">
                        <FaArrowLeft className="cursor-pointer size-6 hover:text-summaryButtons" 
                        onClick={() => {
                            setAddressState("addresses")
                            setFormData=({
                                firstName: "",
                                lastName: "",
                                country: "",
                                region: "",
                                city: "",
                                address: "",
                                info: "",
                                mobile: ""
                            })
                            setErrors({})
                        }} />
                        <span className="title text-xl font-bold ">Add New Address</span>
                    </div>
                    }

                    {(addressState === 'addresses') &&
                    <div className="methods flex flex-col ">
                        <div className="saved flex flex-col gap-7 py-5 px-5">
                            <div className="address">
                                
                                <div className="flex py-5 gap-3 items-start flex-wrap">
                                    {getAddressesData?.data?.addresses.map((address) => (
                                    <AddressCard address={address} key={address._id} />
                                        
                                    ))}
                                    <div className="add">
                                        <button className="bg-summaryButtons text-white font-semibold py-2 px-4 rounded-md cursor-pointer hover:bg-active flex gap-1 items-center justify-center h-13" onClick={() => setAddressState('new')}>
                                            <FaPlus /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>           
                    </div>
                    }
                </div>
            
            
            
                
            {addressState === 'new' && 
                <AddAddress handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} errors={errors} citiesData={citiesData} regionsData={regionsData} getCitiesLoading={getCitiesLoading} getRegionsLoading={getRegionsLoading} />
            }
            
        </div>
    )
}

export default Address