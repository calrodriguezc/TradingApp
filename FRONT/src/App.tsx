import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from "@/components/ui/button"
import Navbar from './page/Navbar/Navbar'
import Home from './page/Home/Home'
import AlpacaTest from './components/ui/AlpacaTest'
import Login from './page/Login/Login'
import LoginRegister from './page/Login/LoginRegister'
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/Login" element={<LoginRegister />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App