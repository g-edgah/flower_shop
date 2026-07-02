import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../setup/axios';



//getting userId
const getUserId = () => {
    const userId = localStorage.getItem('userId');
    return userId
}


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

// user password editing
export const useEditPassword = (formData) => {
    console.log(`editing password`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.post(`/auth/password/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
    
};


// user email editing
export const useEditEmail = (formData) => {
    console.log(`editing email`) 
    const userId = getUserId()

    return useMutation({ 
        mutationFn: (formData) => api.post(`/auth/email/${userId}`, formData).then(res => res.data),
        enabled: !!userId
    });
    
};