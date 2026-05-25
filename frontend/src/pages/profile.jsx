import Header from '../components/common/header.jsx';
import Footer from '../components/common/footer.jsx';

import { useUser } from '../hooks/user.js'


const ProfilePage = () => {
    const userId = localStorage.getItem('userId')


    const { data: user, isLoading, error, isFetching, refetch } = useUser(userId);

    console.log(user)

    return (
        <div className=" h-full w-full flex flex-col space-y-3 md:space-y-5 items-center">
            <Header />
            <div className="min-h-screen">
                <div className="details">
                    <img src="/bouquets/bouquet-1.jpeg" alt="" className="rounded-full  size-20" />
                </div>
                <div className="auth">

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default ProfilePage