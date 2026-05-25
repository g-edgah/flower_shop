import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../setup/axios';

// hook for home data
export const useUser = (userId) => {
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


// hook for bouquets
export const useCart = (userId) => {
    //console.log(`filters: ${JSON.stringify(filters)}`) 

    return useQuery({ 
        queryKey: ['user', userId],
        queryFn: () => api.gett(`/user/cart/${userId}`).then(res => res.data)
    });
    
};