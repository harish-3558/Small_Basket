import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ordersUrl, productUrl } from "../repo/api_path";
import AddProduct from "../admin/AddProduct";

const VendorDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("userToken");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchProducts = useCallback(
    () => axios.get(`${productUrl}/vendor/mine`, { headers }),
    [headers]
  );
  const fetchOrders = useCallback(
    () => axios.get(`${ordersUrl}/vendor`, { headers }),
    [headers]
  );

  const loadProducts = async () => {
    try {
      const response = await fetchProducts();
      setProducts(response.data.products);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load your products.");
    }
  };

  useEffect(() => {
    let current = true;
    fetchProducts()
      .then((response) => {
        if (current) setProducts(response.data.products);
      })
      .catch((error) => {
        if (current) setMessage(error.response?.data?.message || "Could not load your products.");
      });
    return () => { current = false; };
  }, [fetchProducts]);

  useEffect(() => {
    let current = true;
    fetchOrders()
      .then((response) => {
        if (current) setOrders(response.data.orders);
      })
      .catch((error) => {
        if (current) setMessage(error.response?.data?.message || "Could not load your orders.");
      });
    return () => { current = false; };
  }, [fetchOrders]);

  const fulfillItem = async (orderId, itemId) => {
    try {
      await axios.patch(`${ordersUrl}/vendor/${orderId}/items/${itemId}`, {}, { headers });
      const response = await fetchOrders();
      setOrders(response.data.orders);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update order.");
    }
  };

  return (
    <main className="market-page">
      <section className="market-dashboard-heading">
        <div><p className="market-eyebrow">Vendor workspace</p><h1>Manage your store</h1></div>
        <p>Add products for customers. Only approved vendors can access this page.</p>
      </section>
      <AddProduct onProductAdded={loadProducts} />
      {message && <p className="market-message" role="alert">{message}</p>}
      <section className="market-list">
        <h2>Your products ({products.length})</h2>
        {products.length === 0 && <p>Your store is empty. Add your first product above.</p>}
        {products.map((product) => <article className="market-list-row" key={product._id}>
          <div><strong>{product.name}</strong><p>{product.category} · Rs {product.price} / {product.unit || "unit"}</p></div>
          <span className={`market-status ${product.isAvailable ? "status-approved" : "status-suspended"}`}>{product.isAvailable ? "available" : "unavailable"}</span>
        </article>)}
      </section>
      <section className="market-list">
        <h2>Orders for your store</h2>
        {orders.length === 0 && <p>No customer orders for your products yet.</p>}
        {orders.map((order) => <article className="market-order" key={order._id}>
          <div className="market-order-heading">
            <strong>Order {order._id.slice(-8).toUpperCase()}</strong>
            <span>{order.customer?.name || order.customer?.email}</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          {order.items.map((item) => <div className="market-list-row" key={item._id}>
            <div><strong>{item.productName}</strong><p>{item.quantity} × Rs {item.unitPrice}</p></div>
            {item.status === "processing"
              ? <button onClick={() => fulfillItem(order._id, item._id)}>Mark fulfilled</button>
              : <span className="market-status status-approved">fulfilled</span>}
          </div>)}
        </article>)}
      </section>
      <Link className="market-back-link" to="/">View customer store</Link>
    </main>
  );
};

export default VendorDashboard;
