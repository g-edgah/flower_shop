import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './pages/home.jsx';
import CartPage from './pages/cart.jsx';

import UserLayout from './components/layout/userLayout.jsx'
import AdminLayout from './components/layout/adminLayout.jsx'
import ProfileLayout from './components/layout/profile.jsx'



function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<UserLayout/>}/>
        <Route path='/admin/*' element={<AdminLayout/>}/>
        <Route path='/profile/*' element={<ProfileLayout/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
