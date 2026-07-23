

import React from 'react'
import Home from './page/customer/Home'
import Header from './component/Header'
import {Routes, Route} from 'react-router-dom'
import Login from './page/auth/Login'
import Signup from './page/auth/Signup'

const App = () => {
  return (
    <div className='text-red-700'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App
