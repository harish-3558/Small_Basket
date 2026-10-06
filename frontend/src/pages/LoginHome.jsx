import React from "react";
import { Link } from "react-router-dom";

const LoginHome = () => (
  <main className="market-page">
    <section className="market-intro">
      <p className="market-eyebrow">Welcome to Small Basket</p>
      <h1>Fresh food, from local vendors to your home.</h1>
      <p>Choose how you want to use the marketplace.</p>
    </section>
    <section className="market-role-grid">
      <article className="market-role-card">
        <h2>Customer</h2>
        <p>Browse groceries, add items to your cart, and check out.</p>
        <Link className="market-button" to="/send-otp">Continue with email</Link>
      </article>
      <article className="market-role-card">
        <h2>Vendor</h2>
        <p>Apply to sell products. An admin approves your store before you can list products.</p>
        <Link className="market-button" to="/vendor/login">Vendor sign in or apply</Link>
      </article>
      <article className="market-role-card">
        <h2>Administrator</h2>
        <p>Review vendor applications and manage customer accounts.</p>
        <Link className="market-button market-button-dark" to="/admin/login">Admin sign in</Link>
      </article>
    </section>
  </main>
);

export default LoginHome;
