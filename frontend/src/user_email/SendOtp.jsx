import axios from 'axios'
import React, { useState } from 'react'
import { emailUrl } from '../repo/api_path'
import { useNavigate } from 'react-router-dom'


const SendOtp = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [sending, setSending] = useState(false)

    const navigate = useNavigate()

    const emailHandler = async(e)=>{
        e.preventDefault()
        setSending(true)
        try {
            const res = await axios.post(`${emailUrl}/api_otp`,{
                name, email
            })
            alert(res.data.message || "OTP sent to your email")
            localStorage.setItem("userEmail", email.trim().toLowerCase())
            localStorage.setItem('userName', res.data.name || name)
            setName("")
            setEmail("")
            navigate("/verify-otp")
        } catch (error) {
            const message = error.response?.data?.message
                || (error.code === "ERR_NETWORK"
                    ? `Cannot reach the backend at ${emailUrl}. Make sure it is running on port 3000.`
                    : "Failed to send OTP. Please try again.")
            alert(message)
        } finally {
            setSending(false)
        }
    }

  return (
    <div className='emailSection'>
        <div className="emailHeading">
            *Please enter your Name and Email for OTP
        </div>
        <form onSubmit={emailHandler}
        className='emailForm'
        >
            <h3>Name</h3>
            <input type="text" 
            placeholder='please enter your Name'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            />
            <h3>Email</h3>
            <input type="email" 
            placeholder='please enter your Name'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            />
            <button type='submit' disabled={sending}>
                {sending ? "Sending..." : "Send OTP"}
            </button>
        </form>
    </div>
  )
}

export default SendOtp