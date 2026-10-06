import React from 'react'
import { Link } from 'react-router-dom'

const SearchComp = () => {
  return (
    <div className='shopSection'>
        <div className="shopTitle">
            Shop by Items
        </div>
        <ul>
            <Link to="/all-products">
            <li>All Products</li>
            </Link>
            <Link to="/fruit-products">
            <li>Fruits</li>
            </Link>
            <Link to="/vegetables">
            <li>Vegetables</li>
            </Link>
            <Link to="/food-grains">
            <li>Food Grains</li>
            </Link>
        </ul>
    </div>
  )
}

export default SearchComp