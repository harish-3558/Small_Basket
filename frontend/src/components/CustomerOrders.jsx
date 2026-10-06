import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ordersUrl } from "../repo/api_path";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${ordersUrl}/my`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
    })
      .then((response) => setOrders(response.data.orders))
      .catch((error) => setMessage(error.response?.data?.message || "Could not load your orders."));
  }, []);

  return (
    <main className="market-page">
      <section className="market-dashboard-heading">
        <div><p className="market-eyebrow">Customer account</p><h1>My orders</h1></div>
        <Link className="market-button" to="/">Continue shopping</Link>
      </section>
      {message && <p className="market-message" role="alert">{message}</p>}
      <section className="market-list">
        {orders.length === 0 && !message && <p>You have not placed an order yet.</p>}
        {orders.map((order) => (
          <article className="market-order" key={order._id}>
            <div className="market-order-heading">
              <strong>Order {order._id.slice(-8).toUpperCase()}</strong>
              <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              <strong>Rs {order.total}</strong>
            </div>
            {order.items.map((item) => (
              <div className="market-list-row" key={item._id}>
                <div><strong>{item.productName}</strong><p>{item.quantity} × {item.unit || "unit"} · Rs {item.unitPrice} each</p></div>
                <span className={`market-status status-${item.status}`}>{item.status}</span>
              </div>
            ))}
          </article>
        ))}
      </section>
    </main>
  );
};

export default CustomerOrders;
