import { use, useEffect, useState } from 'react'
import { BiSolidEdit } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useEditUser, useCreateOrder } from '../../../hooks/user/user.js';

import CheckoutAddress from './checkoutAddress.jsx'
import CheckoutPayment from './checkoutPayment.jsx'

const Checkout = ({ cart, subTotal, total, couponCode, setCouponCode, shippingLocation, setShippingLocation, shippingCost, setShippingCost, user, userRefetch, cartRefetch }) => {
    const navigate = useNavigate();
    const [ addressEdit, setAddressEdit ] = useState(false)
    const [ errors, setErrors ] = useState({})
    const [ addressErrors, setAddressErrors ] = useState({})
    const [ saveAddress, setSaveAddress ] = useState(false)
    const [ savePayMethod, setSavePayMethod ] = useState(false)

    const [ payMethod, setPayMethod ]  = useState('card')


    useEffect(() => {
        userRefetch()
        cartRefetch()

        if (cart.length === 0) {
            navigate('/cart')
        }
    }, [])

    const [formData, setFormData] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        address: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            country: user?.address?.country,
            region: user?.address?.region,
            city: user?.address?.city,
            address: user?.address?.address,
            info: user?.address?.info,
            mobile: user?.address?.mobile
        },
        paymentMethod: payMethod

    });


    // address edit hook
    const { mutate: editUser, isLoading, error, userdata } = useEditUser();

    // order creation
    const { mutate: createOrder, isLoading: createOrderLoading, error: createOrderError } = useCreateOrder();


    const handleAddress = (state) => {
        //console.log("handling address: ", state)
        setAddressEdit(state)
    }


    // validate address
    const validateForm = () => {
        const newErrors = {};
        
        
        if (!formData?.address?.firstName) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData?.address?.lastName) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData?.address?.region) {
            newErrors.region = 'Region is required';
        }

        if (!formData?.address?.city) {
            newErrors.city = 'City is required';
        }

        if (!formData?.address?.address) {
            newErrors.address = 'Address is required';
        }

        if (!formData?.address?.mobile) {
            newErrors.mobile = 'Mobile number is required';
        }
           
        return newErrors;
    };

    // validate user has a valid saved address
    const validateAddress = () => {
        const newErrors = {};
        
        if (!user?.address?.firstName) {
            newErrors.firstName = 'First name is required';
        }

        if (!user?.address?.lastName) {
            newErrors.lastName = 'Last name is required';
        }

        if (!user?.address?.region) {
            newErrors.region = 'Region is required';
        }

        if (!user?.address?.city) {
            newErrors.city = 'City is required';
        }

        if (!user?.address?.address) {
            newErrors.address = 'Address is required';
        }

        if (!user?.address?.mobile) {
            newErrors.mobile = 'Mobile number is required';
        }
           
        return newErrors;
    }


  
    // handle address input
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
    

    // submit address(save address)
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("e: ",e)



        console.log(formData)
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.dismiss();
            toast.error('Please fill in all required address fields.', {
                className: 'custom-toast--error',
            });
            
            return;
        }
        
        editUser(formData, {
            onSuccess: (data) => {
                console.log('Edit successfull!', data)
                
                toast.dismiss();
                toast.success('Delivery info updated successfully!', {
                    className: 'custom-toast--success',
                });

                userRefetch()
                refetch()     
            
            },
            onError: (error) => {
                console.error('Edit failed: ', error)

                toast.dismiss();
                toast.error('Failed to update delivery info. Please try again', {
                    className: 'custom-toast--error',
                });
               
                setAddressEdit(true)
                
               
            }
        })

        
        setAddressEdit(false)
        
               
    };



    const handleCreateOrder = () => {

        const formdataErrors = validateForm();
        const addressErrors = validateAddress();

        // user has no valid address saved and has not provided one
        if (Object.keys(formdataErrors).length > 0 && Object.keys(addressErrors).length > 0) {
            setErrors(formdataErrors);
            setAddressErrors(addressErrors);
            setAddressEdit(true)
            toast.dismiss();
            toast.error('Please fill in all required address fields.', {
                className: 'custom-toast--error',
            });
            return;
        }

        // user has a valid address filled in
        if (Object.keys(formdataErrors).length === 0 && Object.keys(addressErrors).length > 0) {
            setErrors(formdataErrors);
            setAddressErrors(addressErrors);
            setAddressEdit(false)
            if(saveAddress){
                handleSubmit()
            }
            return;
        }

        // user has a valid saved address
        if (Object.keys(formdataErrors).length > 0 && Object.keys(addressErrors).length === 0) {
            setErrors(formdataErrors);
            setAddressErrors(addressErrors);
            setAddressEdit(true)
            toast.dismiss();
            toast.error('Please provide a valid address.', {
                className: 'custom-toast--error',
            });
            return;
        }
        

        
        const orderData = {
            cart,
            subTotal,
            shippingCost,
            total,
            payment: formData.paymentMethod,
            shippingAddress: formData.address
        }

        createOrder(orderData, {
            onSuccess: (data) => {
                console.log('Order created successfully!', data)
                userRefetch()
                refetch()

                toast.success('Order placed successfully!', {
                    className: 'custom-toast--success',
                });
                navigate('/profile/orders')
                
            },
            onError: (error) => {
                console.error('Order creation failed: ', error)
                toast.error('Order creation failed. Please try again.!', {
                    className: 'custom-toast--error',
                });
                
            }
        })
    }



    return (
        <div className="checkout w-full flex justify-center items-start pt-10 pb-23">
            <div className="checkout w-6/10 flex flex-col items-center space-y-5 max-w-200">

                <CheckoutAddress addressEdit={addressEdit} handleChange={handleChange} handleAddress={handleAddress} handleSubmit={handleSubmit} errors={errors} formData={formData} user={user} isLoading={isLoading}/>

                <CheckoutPayment formData={formData} handleChange={handleChange} payMethod={payMethod} setPayMethod={setPayMethod}/>

                <button className="bg-checkoutButtons hover:bg-checkoutButtonsHover hover:bg-gray-450 w-40 md:w-50 h-10 rounded-xl hover:shadow-md hover:shadow-gray-600 transition text-white" onClick={()=> navigate('/cart')}>go back</button>
            </div>
            <div className="summary fllex flex-col w-70 space-y-5">
                <div className="summaryContainer flex flex-col w-full max-w-[95vw] mx-auto py-3 px-4 md:p-6 space-y-4 bg-cartCard font-normal text-md text-summaryText rounded-lg">
                    <div className="cartTotal">
                        <span>Sub Total: Ksh </span>
                        <span className="amount">{subTotal}</span>
                    </div>

                    <div className="coupon">
                        <form ></form>
                        <input 
                            className="p-2 bg-white w-30 h-10 rounded-md border text-summaryButtons focus:outline-none border-gray-400"
                            type="text" 
                            placeholder="voucher code" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button className='ml-4 text-summaryButtonsText bg-summaryButtons w-20 h-9.5 md:h-10 rounded-md hover:bg-active transition'>apply</button>
                    </div>

                    <div className="payableAmount flex flex-col space-y-2 md:space-y-4">
                        <span className=''>Shipping: Ksh {shippingCost}</span>
                        <span className='font-bold text-lg'>Total: Ksh {total}</span>
                        
                    </div>

                </div>

                <div className="cartActions mx-auto justify-center flex flex-row space-x-5 md:space-x-16 text-checkoutButtonsText pr-1 pb-15">
                    
                    <button className="bg-summaryButtons w-40 md:w-50 h-10 rounded-xl hover:shadow-md hover:shadow-gray-600 hover:bg-active transition" onClick={handleCreateOrder}>Confirm order</button>
                    
                </div>
            </div>
        </div>

    )
}

export default Checkout