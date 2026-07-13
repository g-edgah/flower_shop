import { useState, useEffect } from 'react'
import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import axios from 'axios'

import { getUserAddresses, addAddress, removeAddress, updateAddress, editDefaultAddress, getRegions, getCities } from '../../../../hooks/user/user.js';

import AddAddress from './addAddress.jsx'


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
       

        // clear error for this field when user starts typing
        if (errors[name]) {
        setErrors({
            ...errors,
            [name]: '',
        });
        }
    };




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


    

    //get regions
    const { data: regionsData, isLoading: getRegionsLoading, error: getRegionsError, isFetching: getRegionsFetching, refetch: getRegionsRefetch } = getRegions();
    
    //get cities
    const { data: citiesData, isLoading: getCitiesLoading, error: getCitiesError, isFetching: getCitiesFetching, refetch: getCitiesRefetch } = getCities();

    //get user addresses
    const { data: getAddressesData, isLoading: getAddressesLoading, error: getAddressesesError, isFetching: getAddressesFetching, refetch: getAddressesRefetch } = getUserAddresses();
    
    // add address
    const { mutate: addAddress, isLoading: addAddressLoading, error: addAddressError, data: addAddressData } = addAddress();

    // remove address
    const { mutate: removeAddress, isLoading: removeAddressLoading, error: removeAddressError, data: removeAddressData } = removeAddress();

    // update address
    const { mutate: updateAddress, isLoading: updateAddressLoading, error: updateAddressError, data: updateAddressData } = updateAddress();


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
        <div className="flex flex-col p-3 justify-around gap-10 w-full">
            <div className="title border-b border-gray-300 w-10/10 p-3">
                    <span className="title text-xl font-bold ">Address Book</span>
            </div>
            <div className="flex justify-between gap-3">
                
                {addressState === 'new' && 
                    <AddAddress />
                }
            </div>
        </div>
    )
}

export default Address