import React from "react";
import { Link } from "react-router-dom";
import posed from "react-pose";

const ProductItem = posed.li({
  shown: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  }
});

export default ({ _id, imageUrl, name, category }) => (
  <ProductItem
    style={{ background: `url(${imageUrl}) center center / cover no-repeat` }}
    className="card"
  >
    <span className={category}>{category}</span>
    <div className="card-text">
      <Link to={`/products/${_id}`}>
        <h3>{name}</h3>
      </Link>
    </div>
  </ProductItem>
);
