import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../setup/axios';


//getting userId
const userId = localStorage.getItem('userId');


// hook for home data
export const useUser = () => {
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
    //console.log(`formdata: ${JSON.stringify(formData)}`) 

    return useMutation({ 
        mutationFn: (formData) => api.patch(`/user/${userId}`, formData).then(res => res.data)
    });
    
};


// getting cart
export const useCart = () => {
    //console.log(`filters: ${JSON.stringify(filters)}`) 

    return useQuery({ 
        queryKey: ['user', userId],
        queryFn: () => api.get(`/user/cart/${userId}`).then(res => res.data)
    });
    
};

// user cart editing
export const useAddCart = (formData) => {
    //console.log(`formdata: ${JSON.stringify(formData)}`) 

    return useMutation({ 
        mutationFn: (formData) => api.post(`/user/cart/${userId}`, formData).then(res => res.data)
    });
    
};


// user cart editing
export const useMinusCart = (formData) => {
    //console.log(`formdata: ${JSON.stringify(formData)}`) 

    return useMutation({ 
        mutationFn: (formData) => api.patch(`/user/cart/${userId}`, formData).then(res => res.data)
    });
    
};


// user cart editing
export const useDeleteCart = (formData) => {
    //console.log(`formdata: ${JSON.stringify(formData)}`) 

    return useMutation({ 
        mutationFn: (formData) => api.delete(`/user/cart/${userId}`, formData).then(res => res.data)
    });
    
};

// getting wishlist
export const useWishlist = () => {
    //console.log(`filters: ${JSON.stringify(filters)}`) 

    return useQuery({ 
        queryKey: ['user', userId],
        queryFn: () => api.get(`/user/wishlist/${userId}`).then(res => res.data)
    });
    
};

// user wishlist editing
export const useEditWishlist = () => {

    return useMutation({ 
        mutationFn: (formData) => api.post(`/user/wishlist/${userId}`, formData).then(res => res.data)
    });
    
};