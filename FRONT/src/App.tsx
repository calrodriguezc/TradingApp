import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from "@/components/ui/button"
import Home from './page/Home/Home'
import LoginRegister from './page/Login/LoginRegister'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Wallet from './page/Wallet'
import Profile from './page/Profile'
import PaymentDetails from './page/PaymentDetails'
import PortfolioPage from './page/PortfolioPage'
import { UserProvider } from './page/Navbar/UserContext'
import Navbar from './page/Navbar/Navbar'
import Sidebar from './page/Navbar/Sidebar'
import InvestorsPage from './page/InvestorPage'
import ChooseCommissionPage from './page/ChooseCommissionPage'


function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/Login" element={<LoginRegister />} />
          <Route path="/Navbar" element={<Navbar />} />
          <Route path="/Sidebar" element={<Sidebar />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payment-details" element={<PaymentDetails />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/commission/investors" element={<InvestorsPage />} />
          <Route path="/choose-commission" element={<ChooseCommissionPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App