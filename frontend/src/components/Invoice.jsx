import React, { useEffect, useState } from "react";
import axios from "axios";
import { cartUrl, getProductImageUrl, ordersUrl } from "../repo/api_path";
import { useNavigate } from "react-router-dom";

const Invoice = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${cartUrl}/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((response) => setCart(response.data.cart))
      .catch((error) => setMessage(error.response?.data?.message || "Could not load your cart."))
      .finally(() => setLoading(false));
  }, []);

  const placeOrder = async () => {
    setPlacingOrder(true);
    setMessage("");
    try {
      await axios.post(ordersUrl, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }
      });
      navigate("/orders");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not place your order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <h3>Loading invoice...</h3>;
  if (message && !cart) return <p className="market-message" role="alert">{message}</p>;
  if (!cart || cart.items.length === 0)
    return <h3>No items for checkout</h3>;

  // 🧮 Calculations
  const subTotal = cart.items.reduce((acc, item) => {
    if (!item.product) return acc;
    return acc + item.product.price * item.quantity;
  }, 0);

  const tax = Math.round(subTotal * 0.05); // 5% GST
  const deliveryCharge = subTotal > 500 ? 0 : 40;
  const finalAmount = subTotal + tax + deliveryCharge;

  return (
    <div className="invoiceContainer">
      <h2>🧾 Invoice</h2>

      {cart.items.map((item) => {
        if (!item.product) return null;

        return (
          <div className="invoiceItem" key={item._id}>
            <img
              src={getProductImageUrl(item.product.image)}
              alt={item.product.name}
              width="70"
            />

            <div className="invoiceDetails">
              <h4>{item.product.name}</h4>
              <p>
                Rs {item.product.price} / {item.product.unit || "unit"} × {item.quantity}
              </p>
              <strong>
                Rs {item.product.price * item.quantity}
              </strong>
            </div>
          </div>
        );
      })}

      <hr />

      <div className="invoiceSummary">
        <p>Subtotal: <span>Rs {subTotal}</span></p>
        <p>GST (5%): <span>Rs {tax}</span></p>
        <p>Delivery: <span>Rs {deliveryCharge}</span></p>
        <h3>Total Payable: Rs {finalAmount}</h3>
      </div>

      {message && <p className="market-message" role="alert">{message}</p>}
      <button className="checkoutBtn" disabled={placingOrder} onClick={placeOrder}>
        {placingOrder ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
};

export default Invoice;
