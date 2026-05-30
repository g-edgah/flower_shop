import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Profile from '../pages/profile.jsx';
import Footer from '../components/common/footer.jsx';
import Login from '../components/profile/login.jsx';
import Register from '../components/profile/register.jsx';
import TopBar from '../components/common/topBar.jsx'
import NavBar from '../components/common/navBar.jsx';

const ProfileLayout = ({ userData, isUserLoading, userError, isUserFetching, userRefetch }) => {
    const [page, setPage] = useState("profile")

    const handlePage = (page) => {
        e.preventDefault()
        if (page) {
            setPage(page)
            console.log(page)
        }
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <TopBar />
            <NavBar page={page} setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch} />
            <Routes>
                <Route index element={<Profile setPage={setPage} userData={userData} isUserLoading={isUserLoading} userError={userError} isUserFetching={isUserFetching} userRefetch={userRefetch}/>}/>
                <Route path='login' element={<Login setPage={setPage} />}/>
                <Route path='register' element={<Register setPage={setPage} />}/>

            </Routes>

            <Footer/>
            
            
        </div>
    )
}

export default ProfileLayout