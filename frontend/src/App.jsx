

import React from 'react'
import Home from './page/customer/Home'
import Header from './component/Header'
import {Routes, Route} from 'react-router-dom'

const App = () => {
  return (
    <div className='text-red-700'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
