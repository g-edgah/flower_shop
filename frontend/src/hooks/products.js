import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../setup/axios';

// hook for home data
export const useHome = () => {
    return useQuery({
        queryKey: ['home'],
        queryFn: () => api.get('/home').then(res => res.data)
    });
};

// hook for bouquets
export const useBouquets = () => {
    return useQuery({
        queryKey: ['bouquets'],
        queryFn: () => api.get('/products/bouquets').then(res => res.data)
    });
};

// hook for flowers
export const useFlowers = () => {
    return useQuery({
        queryKey: ['flowers'],
        queryFn: () => api.get('/products/flowers').then(res => res.data)
    });
};

// hook for popular products
export const usePopular = () => {
    return useQuery({
        queryKey: ['popular'],
        queryFn: () => api.get('/products/popular').then(res => res.data)
    });
};

// hook for florist picks
export const useFloristPicks = () => {
    return useQuery({
        queryKey: ['florist-picks'],
        queryFn: () => api.get('/products/florist-picks').then(res => res.data)
    });
};

// hook for new products
export const useNewProducts = () => {
    return useQuery({
        queryKey: ['new-products'],
        queryFn: () => api.get('/products/new').then(res => res.data)
    });
};

// hook for single product
export const useProduct = (productId) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => api.get(`/products/${productId}`).then(res => res.data),
        enabled: !!productId // Only run if productId exists
    });
};

// hook for creating order (mutation)
export const useCreateOrder = () => {
    return useMutation({
        mutationFn: (orderData) => api.post('/orders/create', orderData)
    });
};