import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../setup/axios';


//getting userId
const userId = localStorage.getItem('userId');


// hook for home data
export const useUser = () => {
    console.log(`fetching user data for userId: ${userId}`)

    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => api.get(`/user/${userId}`).then(res => res.data),
        staleTime: 5 * 60 * 1000, 
        gcTime: 10 * 60 * 1000,    // keep in cache for 10 minutes 
        refetchOnMount: false,     // don't refetch when component mounts
        refetchOnWindowFocus: false, // don't refetch when window regains focus
        refetchOnReconnect: false,   // don't refetch on network reconnection
        retry: 1,                    // dnly retry failed requests once
        retryDelay: 1000,
    });
};

// user details editing
export const useEditUser = (formData) => {
    console.log(`editing user`) 

    return useMutation({ 
        mutationFn: (formData) => api.patch(`/user/${userId}`, formData).then(res => res.data)
    });
    
};


// getting cart
export const useCart = () => {
    console.log(`fetching cart for userId: ${userId}`) 

    return useQuery({ 
        queryKey: ['cart', userId],
        queryFn: () => api.get(`/user/cart/${userId}`).then(res => res.data)
    });
    
};



// user cart editing
export const useAddCart = (formData) => {
    console.log(`adding to cart`) 

    return useMutation({ 
        mutationFn: (formData) => api.post(`/user/cart/${userId}`, formData).then(res => res.data)
    });
    
};


// user cart editing
export const useMinusCart = (formData) => {
    console.log(`minusing from cart`) 

    return useMutation({ 
        mutationFn: (formData) => api.patch(`/user/cart/${userId}`, formData).then(res => res.data)
    });
    
};


// user cart editing
export const useDeleteCart = () => {
    console.log(`deleting from cart`) 

    return useMutation({ 
        mutationFn: (formData) => api.delete(`/user/cart/${userId}/${formData.productId}`).then(res => res.data)
    });
    
};

// getting wishlist
export const useWishlist = () => {
    console.log(`getting the wishlist`) 

    return useQuery({ 
        queryKey: ['wishlist', userId],
        queryFn: () => api.get(`/user/wishlist/${userId}`).then(res => res.data)
    });
    
};

// user wishlist editing
export const useEditWishlist = () => {
    console.log(`editting the wishlist`) 

    return useMutation({ 
        mutationFn: (formData) => api.post(`/user/wishlist/${userId}`, formData).then(res => res.data)
    });
    
};

// creating order 
export const useCreateOrder = () => {
    console.log(`creating order`) 

    return useMutation({
        mutationFn: (orderData) => api.post(`/user/orders/${userId}`, orderData).then(res => res.data)
    });
};

// getting orders
export const useOrders = () => {
    console.log(`getting them orders`) 

    return useQuery({ 
        queryKey: ['orders', userId],
        queryFn: () => api.get(`/user/orders/${userId}`).then(res => res.data)
    });
    
};