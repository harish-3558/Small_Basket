import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { cartUrl, getProductImageUrl } from "../repo/api_path";
import useAuthStore from "../store/useAuthStore";
import Checkout from "./Checkout";

const ShowCart = () => {
  const [cartDetail, setCartDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const setCartCount = useAuthStore((state) => state.setCartCount);
  const token = localStorage.getItem("userToken");

  const fetchCart = useCallback(
    () => axios.get(`${cartUrl}/details`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const applyCart = useCallback((cart) => {
    setCartDetail(cart);
    setCartCount(cart.items.reduce((total, item) => total + item.quantity, 0));
  }, [setCartCount]);

  useEffect(() => {
    let current = true;
    fetchCart()
      .then((response) => {
        if (current) applyCart(response.data.cart);
      })
      .catch((error) => console.error(error.response?.data || error.message))
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [applyCart, fetchCart]);

  const deleteHandler = async (productId) => {
    try {
      const response = await axios.delete(`${cartUrl}/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      applyCart(response.data.cart);
    } catch (error) {
      alert(error.response?.data?.message || "Could not remove this product.");
    }
  };

  if (loading) return <h3>Loading cart...</h3>;
  if (!cartDetail || cartDetail.items.length === 0) {
    return <div className="cartEmpty">Your cart is empty</div>;
  }

  return (
    <div className="cartContainer">
      <div className="cartTitle">My Cart</div>
      {cartDetail.items.map((item) => {
        if (!item.product) return null;
        return (
          <div className="cartItem" key={item._id}>
            <img
              src={getProductImageUrl(item.product.image)}
              alt={item.product.name}
              width="80"
            />
            <div className="subCart">
              <h4>{item.product.name}</h4>
              <p>Rs {item.product.price} / {item.product.unit || "unit"}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Rs {item.product.price * item.quantity}</p>
              <button className="cartDelete" onClick={() => deleteHandler(item.product._id)}>
                Remove
              </button>
            </div>
          </div>
        );
      })}
      <Checkout />
    </div>
  );
};

export default ShowCart;
