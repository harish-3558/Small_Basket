import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productUrl, getProductImageUrl, cartUrl } from "../repo/api_path";
import useAuthStore from "../store/useAuthStore";

const DetailComponent = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, incrementCart } = useAuthStore();


  useEffect(() => {
    let current = true;
    axios.get(`${productUrl}/${id}`)
      .then((response) => {
        if (current) setProduct(response.data.record);
      })
      .catch((error) => console.error(error.response?.data || error.message))
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [id]);


  const addToCartHandler = async () => {
    try {
      if (!isLoggedIn) {
        alert("Please login first");
        return;
      }

      const token = localStorage.getItem("userToken");

      const res = await axios.post(
        `${cartUrl}/add-to-cart`,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);

      incrementCart(1);

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert(error.response?.data?.msg || "Something went wrong");
    }
  };

  // ==========================
  // UI
  // ==========================
  if (loading) return <h2>Loading...</h2>;

  if (!product) return <h2>Product not found</h2>;

  return (
    <div className="detailSection">
      <div className="imgCont">
        <img
          className="singleImage"
          src={getProductImageUrl(product.image)}
          alt={product.name}
        />
      </div>

      <div className="singleDetail">
        <div className="singleName">
          {product.name}
        </div>

        {product.vendorId?.storeName && (
          <div className="singleVendor">Sold by {product.vendorId.storeName}</div>
        )}

        <div className="singlePrice">
          Price: Rs {product.price} / {product.unit || "unit"}
        </div>

        <div className="singleDesc">
          Description: {product.desc}
        </div>

        <div className="singleBtn">
          <button
            className="singleCartBtn"
            onClick={addToCartHandler}
          >
            Add To Cart
          </button>

          <button className="singleLaterBtn">
            Save for later
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailComponent;
