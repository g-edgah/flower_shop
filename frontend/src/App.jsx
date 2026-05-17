import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './pages/home.jsx';
import ProfilePage from './pages/profile.jsx';
import CartPage from './pages/cart.jsx';

import UserLayout from './components/layout/userLayout.jsx'
import AdminLayout from './components/layout/adminLayout.jsx'



function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/*' element={<UserLayout/>}>
          
        </Route>
        <Route path='/admin' element={<AdminLayout/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
