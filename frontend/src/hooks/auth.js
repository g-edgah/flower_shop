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

//getting userId
const userId = localStorage.getItem('userId');

// logout
export const useLogout = () => {
    //console.log('logout mutation') 

    return useMutation({ 
        mutationFn: () => api.get(`/auth/logout/${userId}`).then(res => res.data)
    });
    
};