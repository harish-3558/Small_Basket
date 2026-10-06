import React, { useEffect, useState } from "react";
import axios from "axios";
import { productUrl, getProductImageUrl, cartUrl } from "../repo/api_path";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useSearchStore from "../store/useSearchStore";
import SearchFilter from "./SearchFilter";

const ShowProducts = () => {
  const [showProducts, setShowProducts] = useState([]);
  const quantity = 1;

  // 🌍 GLOBAL SEARCH
  const { search } = useSearchStore();

  // 🎯 LOCAL FILTERS
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { incrementCart } = useAuthStore();

  useEffect(() => {
    let current = true;
    const request = category === "All" && !search
      ? axios.get(`${productUrl}/all-products`)
      : axios.get(`${productUrl}/search`, {
        params: {
          search,
          category: category === "All" ? "" : category,
          sortBy,
          order,
          page: 1,
          limit: 10,
        },
      });

    request
      .then((response) => {
        if (current) setShowProducts(response.data.products || response.data.data || []);
      })
      .catch((error) => console.error(error.response?.data || error.message));

    return () => { current = false; };
  }, [search, category, sortBy, order]);

  const cartHandler = async (productId, quantity) => {
    const userToken = localStorage.getItem("userToken");

    try {
      await axios.post(
        `${cartUrl}/add-to-cart`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      alert("Product added to cart");
      incrementCart(quantity);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {/* 🎛 Category / Sort only */}
      <SearchFilter
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
      />

      {/* 🛒 Products */}
      <div className="productSection">
        {showProducts.map((product) => (
          <section className="proSection" key={product._id}>
            <Link to={`/single/${product._id}`}>
              <div className="proImage">
                <img src={getProductImageUrl(product.image)} alt={product.name} />
                <h3 className="proName">{product.name}</h3>
                <p className="proVendor">Sold by {product.vendorId?.storeName || "Marketplace vendor"}</p>
              </div>
            </Link>

            <div className="proSub">
              <span>{product.unit || "unit"}</span>
              <h3 className="proPrice">Rs {product.price}</h3>
            </div>

            <button
              className="proButton"
              onClick={() => cartHandler(product._id, quantity)}
            >
              Add to Cart
            </button>
          </section>
        ))}
      </div>
    </>
  );
};

export default ShowProducts;
