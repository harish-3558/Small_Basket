import React from "react";

const SearchFilter = ({
  category,
  setCategory,
  sortBy,
  setSortBy,
  order,
  setOrder,
}) => {
  return (
    <div className="filterBar">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="fruits">Fruits</option>
        <option value="vegetables">Vegetables</option>
      </select>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="createdAt">Newest</option>
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>

      <select value={order} onChange={(e) => setOrder(e.target.value)}>
        <option value="desc">High → Low</option>
        <option value="asc">Low → High</option>
      </select>
    </div>
  );
};

export default SearchFilter;

