import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useLogin } from '../../hooks/user/auth.js';

const Login = ({localWishlist, setLocalWishlist, localCart, setLocalCart, userRefetch, cartRefetch, wishlistRefetch, page = ''}) => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        cart: localCart.cart || [],
        wishlist: localWishlist || [],
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    // hook
    const { mutate: login, isLoading, error: apiError } = useLogin();

    // validate form
    const validateForm = () => {
        const newErrors = {};
        
        
        if (!formData.password) {
        newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.email) {
        newErrors.email = 'Email is required';
        newErrors.password = ''
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
        newErrors.password = ''
        }
        
        return newErrors;
    };


    // handle input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });

        // clear error for this field when user starts typing
        if (errors[name]) {
        setErrors({
            ...errors,
            [name]: '',
        });
        }
    };

    //form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        
        // api call
        // login mutation
        login(formData, {
            onSuccess: (data) => {
                console.log('Login successful:', data);
                
                // reset localCart and localWishlist
                localStorage.setItem('cart', JSON.stringify({
                    cart: [], 
                    subTotal: 0,
                    region: 'nairobi',
                    shippingCost: 0,
                    grandTotal: 0
                }));

                localStorage.setItem('wishlist', JSON.stringify([]));


                // store jwt
                if (data.token) {
                    console.log("token: ", data.token)
                    localStorage.setItem('token', data.token);
                    if (formData.rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                }

                // store userId
                if (data.userId) {
                    console.log("userId: ", data.userId)
                    localStorage.setItem('userId', data.userId);
                    if (formData.rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                }

                // refetch user data
                userRefetch()
                cartRefetch()
                wishlistRefetch()
                
                toast.success('Successfully logged in!', {
                    className: 'custom-toast--success',
                });
                
                // redirect to previous page
                if (page === 'profile') {
                    navigate(`/${page}/account`);
                } else {
                    navigate(`/${page}`);
                }
                // Or window.location.href = '/dashboard';

                
            },
            onError: (error) => {
                console.error('Login failed:', error);
                // Handle specific error messages from API
                if (error.response?.status === 400) {
                    setErrors({ 
                        email: 'Invalid email or password',
                        password: 'Invalid email or password'
                     });
                    toast.error('Invalid email or password', {
                    className: 'custom-toast--error',
                });
                } else {
                    setErrors({ general: 'Login failed. Please try again.' });
                    toast.error('Login failed. Please try again.', {
                    className: 'custom-toast--error',
                });
                }
            }
        });
    };

    return (
        <div className="min-h-screen flex flex-col pt-30 items-center gap-7">
            <span className="title text-center w-full text-xl font-bold">Sign In</span>
            <form onSubmit={handleSubmit} className="form bg-cartCard px-3 py-5 rounded-lg flex flex-col gap-8">
                <div className="mt-5 email flex flex-col gap-2 w-100">
                    <span className='text-md font-bold pl-3'>email:</span>
                    <input 
                        className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                        type="email" 
                        id='email' 
                        name='email'
                        value={formData.email}
                        onChange={(e) => {handleChange(e)}}
                        placeholder='you@somedomain.com'
                    />
                    {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                <div className="password relative flex flex-col gap-2 w-100">
                    <span className='text-md font-bold pl-3'>password:</span>
                    <input 
                        className={`w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-1 focus:ring-topbar focus:border-topbar transition`}
                        type={showPassword ? 'text' : 'password'}
                        id='password' 
                        name='password'
                        value={formData.password}
                        onChange={(e) => {handleChange(e)}}
                        placeholder='password'
                    />


                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-11 right-0 pr-3 flex items-center text-black cursor-pointer"
                    >
                        {!showPassword ? (
                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                        )}
                    </button>
                

                    {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                

                
                    
                </div>

                {/* forgot password*/}
                <div className="flex justify-start">
                    <Link to="/profile/forgot" className="text-sm text-footer hover:text-indigo-500 hover:underline">
                    Forgot password?
                    </Link>
                </div>
                
                <div className="w-full flex justify-center">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-30 mt-2 cursor-pointer bg-active text-white py-2 px-4 rounded-lg hover:bg-footer focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Signing in...
                        </div>
                        ) : (
                        'Sign In'
                        )}
                    </button>
                </div>
                

            </form>
            <div className="flex items-center">
                <span className="text-lg">Don't have an account?</span>
                <Link to='/register' className=" cursor-pointer text-active py-2 px-4 rounded-lg hover:text-footer focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed font-medium">Sign Up</Link>
            </div>

        </div>
    )
}

export default Login