import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { cartUrl, getProductImageUrl, productUrl } from '../repo/api_path'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const VegetableProducts = () => {
    const [vegetables, setVegetables] = useState([])
    const quantity = 1;

    const { incrementCart } = useAuthStore()

    useEffect(() => {
        let current = true;
        axios.get(`${productUrl}/search?category=vegetables`)
            .then((response) => {
                if (current) setVegetables(response.data.data);
            })
            .catch((error) => console.error(error.response?.data || error.message));
        return () => { current = false; };
    }, [])

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
      alert(error.response?.data?.message || "Please sign in as a customer to add products.");
    }
  };

    return (
     <div className="containerSection">
        <div className="itemTitle">Category: <span>Fresh Vegetables</span> </div>
           <div className='productSection'>
            {vegetables.map((product) => {
                return (
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
                )
            })}
        </div>
     </div>
    )
}

export default VegetableProducts