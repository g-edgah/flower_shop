import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../setup/axios';


// registration
export const useRegister = (formData) => {
    //console.log(`formdata: ${JSON.stringify(formData)}`) 

    return useMutation({ 
        mutationFn: (formData) => api.post('/auth/register', formData).then(res => res.data)
    });
    
};

// login
export const useLogin = (formData) => {
    //console.log(`formdata: ${JSON.stringify(formData)}`) 

    return useMutation({ 
        mutationFn: (formData) => api.post('/auth/login', formData).then(res => res.data)
    });
    
};