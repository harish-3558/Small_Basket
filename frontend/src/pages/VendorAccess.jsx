import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { vendorUrl } from "../repo/api_path";
import useAuthStore from "../store/useAuthStore";

const VendorAccess = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (isRegistering) {
        const response = await axios.post(`${vendorUrl}/register`, { name, storeName, email, password });
        setMessage(response.data.message);
        setIsRegistering(false);
        setPassword("");
      } else {
        const response = await axios.post(`${vendorUrl}/login`, { email, password });
        login(response.data.vendor, response.data.token, "vendor");
        navigate("/vendor/dashboard");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not reach the server. Check that the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="market-page market-form-page">
      <form className="market-form" onSubmit={submit}>
        <p className="market-eyebrow">Vendor portal</p>
        <h1>{isRegistering ? "Apply to become a vendor" : "Vendor sign in"}</h1>
        {isRegistering && <>
          <label>Your name<input required value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label>Store name<input required value={storeName} onChange={(event) => setStoreName(event.target.value)} /></label>
        </>}
        <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" minLength="8" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {isRegistering && <p className="market-help">Your application will stay pending until an admin approves it.</p>}
        {message && <p className="market-message" role="status">{message}</p>}
        <button className="market-button" disabled={busy}>{busy ? "Please wait..." : isRegistering ? "Submit application" : "Sign in"}</button>
        <button className="market-link-button" type="button" onClick={() => { setIsRegistering(!isRegistering); setMessage(""); }}>
          {isRegistering ? "Already approved? Sign in" : "New vendor? Apply here"}
        </button>
        <Link className="market-back-link" to="/login">Back to role selection</Link>
      </form>
    </main>
  );
};

export default VendorAccess;
