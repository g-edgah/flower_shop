import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../setup/axios';


//getting userId
const getUserId = () => {
    const userId = localStorage.getItem('userId');
    return userId
}

// hook for home data
export const useUser = () => {
    const userId = getUserId()

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
        enabled: !!userId
    });
};

// user details editing
export const useEditUser = (formData) => {
    console.log(`editing user`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.patch(`/user/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
    
};


// getting cart
export const useCart = () => {
    const userId = getUserId()
    console.log(`fetching cart for userId: ${userId}`) 

    return useQuery({ 
        queryKey: ['cart', userId],
        queryFn: () => api.get(`/user/cart/${userId}`).then(res => res.data),
        enabled: !!userId
    });
    
};



// user cart editing
export const useAddCart = (formData) => {
    console.log(`adding to cart`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.post(`/user/cart/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
    
};


// user cart editing
export const useMinusCart = (formData) => {
    console.log(`minusing from cart`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.patch(`/user/cart/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
    
};


// user cart editing
export const useDeleteCart = () => {
    console.log(`deleting from cart`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.delete(`/user/cart/${userId}/${formData.productId}`).then(res => res.data),
        enabled: !!userId
    });
    
};

// getting wishlist
export const useWishlist = () => {
    console.log(`getting the wishlist`) 
    const userId = getUserId()    

    return useQuery({ 
        queryKey: ['wishlist', userId],
        queryFn: () => api.get(`/user/wishlist/${userId}`).then(res => res.data),
        enabled: !!userId
    });
    
};

// user wishlist editing
export const useEditWishlist = () => {
    console.log(`editting the wishlist`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.post(`/user/wishlist/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
    
};

// creating order 
export const useCreateOrder = () => {
    console.log(`creating order`) 
    const userId = getUserId()

    return useMutation({
        mutationFn: (orderData) => api.post(`/user/orders/${userId}`, orderData).then(res => res.data),
        enabled: !!userId
    });
};

// getting orders
export const useOrders = () => {
    console.log(`getting them orders`) 
    const userId = getUserId()

    return useQuery({ 
        queryKey: ['orders', userId],
        queryFn: () => api.get(`/user/orders/${userId}`).then(res => res.data),
        enabled: !!userId
    });
    
};

// reviewing/rating orders
export const useReview = () => {
    console.log(`reviewing/rating request`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.post(`user/orders/reviews/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
}

// getting vouchers
export const useVouchers = () => {
    console.log(`getting them vouchers`) 
    const userId = getUserId()

    return useQuery({ 
        queryKey: ['vouchers', userId],
        queryFn: () => api.get(`/user/vouchers/${userId}`).then(res => res.data),
        enabled: !!userId
    });
    
};

// getting payment methods
export const usePaymentMethods = () => {
    console.log(`getting them payment methods`) 
    const userId = getUserId()

    return useQuery({ 
        queryKey: ['paymentMethods', userId],
        queryFn: () => api.get(`/user/payment/${userId}`).then(res => res.data),
        enabled: !!userId
    });
    
};

// adding payment method
export const useAddPayment = () => {
    console.log(`add payment method request`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.post(`user/payment/add/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
}

// removing payment method
export const useRemovePayment = () => {
    console.log(`remove payment method request`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.post(`user/payment/remove/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
}

// editing default payment method
export const useEditDefaultPayment = () => {
    console.log(`editing default payment method request`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.post(`user/payment/default/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
}