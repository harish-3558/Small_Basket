import React from 'react'
import LandingPage from './pages/LandingPage'
import { Route, Routes } from 'react-router-dom'
import DetailComponent from './components/DetailComponent'
import Navbar from './components/Navbar'
import SendOtp from './user_email/SendOtp'
import OtpVerify from './user_email/OtpVerify'
import ShowCart from './components/ShowCart'
import Invoice from './components/Invoice'
import FruitProducts from './products/FruitProducts'
import SearchComp from './components/SearchComp'
import AllProducts from './products/AllProducts'
import VegetableProducts from './products/VegetableProducts'
import FoodGrains from './products/FoodGrains'
import LoginHome from './pages/LoginHome'
import VendorAccess from './pages/VendorAccess'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import VendorDashboard from './vendor/VendorDashboard'
import RequireRole from './components/RequireRole'
import CustomerOrders from './components/CustomerOrders'

const App = () => {
  return (
    <div>
      <Navbar />
      <SearchComp />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginHome />} />
        <Route path='/single/:id' element={<DetailComponent />} />
        <Route path='/send-otp' element={<SendOtp />} />
        <Route path='/verify-otp' element={<OtpVerify />} />
        <Route path='/vendor/login' element={<VendorAccess />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route element={<RequireRole role="customer" />}>
          <Route path='/cart' element={<ShowCart />} />
          <Route path='/invoice' element={<Invoice />} />
          <Route path='/orders' element={<CustomerOrders />} />
        </Route>
        <Route element={<RequireRole role="vendor" />}>
          <Route path='/vendor/dashboard' element={<VendorDashboard />} />
          <Route path='/add-product' element={<VendorDashboard />} />
        </Route>
        <Route element={<RequireRole role="admin" />}>
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
        </Route>
        <Route path='/all-products' element={<AllProducts />} />
        <Route path='/fruit-products' element={<FruitProducts />} />
        <Route path='/vegetables' element={<VegetableProducts />} />
        <Route path='/food-grains' element={<FoodGrains />} />
      </Routes>
    </div>
  )
}

export default App