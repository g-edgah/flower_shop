import { useLogout } from '../../hooks/auth.js'
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';



const Logout = ({userData, userRefetch }) => {
    // console.log('userRefetch type from logout: ', typeof userRefetch);
    // console.log('userRefetch value from logout: ', userRefetch);

    const navigate = useNavigate()
    const queryClient = useQueryClient();

    const { mutate: logout, isLoading, error: logoutError } = useLogout();

    const userId = localStorage.getItem('userId')

    const handleLogout = () => {
        logout(userId, {
            onSuccess: (data) => {
                //console.log('Logout successful:', data);
 
                localStorage.removeItem('rememberMe');
                localStorage.removeItem('userId');
                
                //clear all cached data
                queryClient.clear();
                userRefetch()
                

                // redirect out of profile
                navigate('/');
                
                
                
            },
            onError: (error) => {
                console.error('Logout failed:', error);
            }
        });
        
    }

    return (
        <div>
            <div className="title border-b border-gray-300 w-10/10 p-3">
                <span className="title text-xl font-bold ">Log out</span>
            </div>
            <div className="text flex flex-col items-center gap-5 p-6">
                <span className="query">
                    log out of your account?
                </span>
                <button  onClick={()=> handleLogout()} className='text-summaryButtonsText bg-summaryButtons w-30 h-9.5 md:h-10 rounded-md hover:bg-active transition font-semibold cursor-pointer'>log out</button>
            </div>
        </div>
    )
}

export default Logout