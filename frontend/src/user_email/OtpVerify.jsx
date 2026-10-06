
import axios from 'axios'
import React, { useState } from 'react'
import { emailUrl } from '../repo/api_path'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const OtpVerify = () => {

  const userEmail = localStorage.getItem("userEmail")
    const [email, setEmail] = useState(userEmail)
    const [otp, setOtp] = useState("")

    const navigate = useNavigate()
    const {login} = useAuthStore.getState()

    const otpHandler = async(e)=>{
        e.preventDefault()
        const userName = localStorage.getItem("userName")
        try {
            const res = await axios.post(`${emailUrl}/verify_otp`,{
                email, otp
            })
            console.log(res.data)
            alert("verification successfull")
            login({ name: res.data.name || userName, email }, res.data.token, "customer")
            navigate("/")
        } catch (error) {
            alert(error.response?.data?.message || "OTP verification failed. Please try again.")
        }
    }

  return (
    <div className='emailSection'>
        <div className="emailHeading verify">
            OTP Verification
        </div>
        <form onSubmit={otpHandler} className='emailForm'>
    
          <div className="" style={{color:"red"}}>
            OTP is valid for 10 minutes
          </div>
          
                <h3>Email</h3>
                <input type="email" value={email || ""} onChange={(e)=>setEmail(e.target.value)} />
         
          
                <h3>OTP</h3>
                <input type="text" value={otp} onChange={(e)=>setOtp(e.target.value)} />
      
            <button type='submit'>Verify</button>
        </form>
    </div>
  )
}

export default OtpVerify