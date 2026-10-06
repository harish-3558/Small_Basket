import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { cartUrl, getProductImageUrl, productUrl } from '../repo/api_path'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import useSearchStore from '../store/useSearchStore'

const AllProducts = () => {
    const [basket, setBasket] = useState([])
    const quantity = 1;

    const {incrementCart} = useAuthStore()
    const {search} = useSearchStore()

    useEffect(() => {
        let current = true;
        axios.get(`${productUrl}/all-products`)
            .then((response) => {
                if (current) setBasket(response.data.products);
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

  const filteredProducts = basket.filter((product)=>{
   return product.name.toLowerCase().includes(search.toLowerCase())
  })

  console.log("Search:", search);


    return (
        <div className='productSection'>
            {filteredProducts.map((product) => {
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
    )
}

export default AllProducts