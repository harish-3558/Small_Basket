import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { managementUrl } from "../repo/api_path";

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("vendors");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("userToken");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchData = useCallback(() => Promise.all([
        axios.get(`${managementUrl}/vendors`, { headers }),
        axios.get(`${managementUrl}/users`, { headers })
      ]), [headers]);

  const loadData = async () => {
    try {
      const [vendorResponse, userResponse] = await fetchData();
      setVendors(vendorResponse.data.vendors);
      setUsers(userResponse.data.users);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load admin data.");
    }
  };

  useEffect(() => {
    let current = true;
    fetchData()
      .then(([vendorResponse, userResponse]) => {
        if (!current) return;
        setVendors(vendorResponse.data.vendors);
        setUsers(userResponse.data.users);
      })
      .catch((error) => {
        if (current) setMessage(error.response?.data?.message || "Could not load admin data.");
      });
    return () => { current = false; };
  }, [fetchData]);

  const updateVendor = async (vendorId, status) => {
    try {
      await axios.patch(`${managementUrl}/vendors/${vendorId}`, { status }, { headers });
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update vendor.");
    }
  };

  const updateUser = async (userId, isActive) => {
    try {
      await axios.patch(`${managementUrl}/users/${userId}`, { isActive }, { headers });
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update customer.");
    }
  };

  return (
    <main className="market-page">
      <section className="market-dashboard-heading">
        <div><p className="market-eyebrow">Marketplace control</p><h1>Admin dashboard</h1></div>
        <p>Approve vendors before they can publish products. Manage customer access here.</p>
      </section>
      <div className="market-tabs">
        <button className={tab === "vendors" ? "selected" : ""} onClick={() => setTab("vendors")}>Vendors ({vendors.length})</button>
        <button className={tab === "users" ? "selected" : ""} onClick={() => setTab("users")}>Customers ({users.length})</button>
      </div>
      {message && <p className="market-message" role="alert">{message}</p>}
      {tab === "vendors" ? (
        <section className="market-list">
          {vendors.length === 0 && <p>No vendor applications yet.</p>}
          {vendors.map((vendor) => <article className="market-list-row" key={vendor._id}>
            <div><strong>{vendor.storeName}</strong><p>{vendor.name} · {vendor.email}</p><span className={`market-status status-${vendor.status}`}>{vendor.status}</span></div>
            <div className="market-actions">
              {vendor.status !== "approved" && <button onClick={() => updateVendor(vendor._id, "approved")}>Approve</button>}
              {vendor.status !== "rejected" && <button className="secondary" onClick={() => updateVendor(vendor._id, "rejected")}>Reject</button>}
              {vendor.status !== "suspended" && vendor.status === "approved" && <button className="secondary" onClick={() => updateVendor(vendor._id, "suspended")}>Suspend</button>}
            </div>
          </article>)}
        </section>
      ) : (
        <section className="market-list">
          {users.length === 0 && <p>No customers have signed in yet.</p>}
          {users.map((user) => <article className="market-list-row" key={user._id}>
            <div><strong>{user.name}</strong><p>{user.email}</p><span className={`market-status ${user.isActive ? "status-approved" : "status-suspended"}`}>{user.isActive ? "active" : "disabled"}</span></div>
            <button className={user.isActive ? "secondary" : ""} onClick={() => updateUser(user._id, !user.isActive)}>{user.isActive ? "Disable account" : "Enable account"}</button>
          </article>)}
        </section>
      )}
      <Link className="market-back-link" to="/">Back to store</Link>
    </main>
  );
};

export default AdminDashboard;
