import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { adminUrl } from "../repo/api_path";
import useAuthStore from "../store/useAuthStore";

const AdminLogin = () => {
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
      const response = await axios.post(`${adminUrl}/login`, { email, password });
      login(response.data.admin, response.data.token, "admin");
      navigate("/admin/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not reach the server. Check that the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="market-page market-form-page">
      <form className="market-form" onSubmit={submit}>
        <p className="market-eyebrow">Administrator portal</p>
        <h1>Admin sign in</h1>
        <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {message && <p className="market-message" role="alert">{message}</p>}
        <button className="market-button market-button-dark" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</button>
        <Link className="market-back-link" to="/login">Back to role selection</Link>
      </form>
    </main>
  );
};

export default AdminLogin;
