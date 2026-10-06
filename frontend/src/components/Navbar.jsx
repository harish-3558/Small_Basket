import React, { useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { cartUrl } from "../repo/api_path";
import useAuthStore from "../store/useAuthStore";
import useSearchStore from "../store/useSearchStore";

const Navbar = () => {
  const { isLoggedIn, user, role, logout, initializeAuth, cartCount } =
    useAuthStore();

  const { search, setSearch } = useSearchStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoggedIn || role !== "customer") return;

    let current = true;
    axios.get(`${cartUrl}/details`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    })
      .then((response) => {
        if (!current) return;
        const items = response.data.cart?.items || [];
        useAuthStore.getState().setCartCount(
          items.reduce((total, item) => total + item.quantity, 0)
        );
      })
      .catch((error) => {
        console.error(error.response?.data || error.message);
      });

    return () => { current = false; };
  }, [isLoggedIn, role]);

  const displayName = typeof user === "string"
    ? user
    : user?.name || user?.storeName || user?.email || "";

  return (
      <header className="navSection">
        <Link className="nav-brand" to="/" aria-label="Small Basket home">
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="title">Small Basket</span>
        </Link>

        <label className="search nav-search">
          <span className="search-label">Search the store</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <nav className="nav-actions" aria-label="Account navigation">
          {role === "vendor" && <Link className="nav-text-link" to="/vendor/dashboard">Vendor dashboard</Link>}
          {role === "admin" && <Link className="nav-text-link" to="/admin/dashboard">Admin dashboard</Link>}
          {role === "customer" && <Link className="nav-text-link" to="/orders">My orders</Link>}
          {role === "customer" && (
            <Link className="cart" to="/cart" aria-label={`Cart: ${cartCount} items`}>
              <span>Cart</span>
              <span className="cart-count">{cartCount}</span>
            </Link>
          )}
          {isLoggedIn && displayName && (
            <span className="userName">Welcome, <strong>{displayName}</strong></span>
          )}
          {isLoggedIn ? (
            <button className="nav-signin" onClick={logout}>Sign out</button>
          ) : (
            <Link className="nav-signin" to="/login">Sign in</Link>
          )}
        </nav>
      </header>
  );
};

export default Navbar;
