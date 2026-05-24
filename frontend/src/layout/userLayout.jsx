import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from '../components/common/header.jsx';
import Footer from '../components/common/footer.jsx';
import Home from '../pages/home.jsx';
import Bouquets from '../pages/bouquets.jsx';
import Flowers from '../pages/flowers.jsx';
import Design from '../pages/design.jsx';
import Colors from '../pages/colors.jsx';
import Popular from '../pages/popular.jsx';
import CartPage from '../pages/cart.jsx';
import TopBar from '../components/common/topBar.jsx'
import NavBar from '../components/common/navBar.jsx';

const UserLayout = () => {
    const [page, setPage] = useState("home")

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
            <NavBar page={page} setPage={setPage} />
            <Routes>
                <Route index element={<Home setPage={setPage}/>}/>
                <Route path='bouquets' element={<Bouquets setPage={setPage} />}/>
                <Route path='flowers' element={<Flowers setPage={setPage} />}/>
                <Route path='design' element={<Design setPage={setPage} />}/>
                <Route path='popular' element={<Popular setPage={setPage} />}/>
                <Route path='/cart' element={<CartPage setPage={setPage} />}/>

            </Routes>
            
            <Footer />
        </div>
    )
}

export default UserLayout