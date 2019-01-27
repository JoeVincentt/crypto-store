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
  <ProductItem>
    <div className="card">
      <div className="card-image waves-effect waves-block waves-light">
        <img className="activator" src={`${imageUrl}`} alt="productpic" />
      </div>
      <div className="card-content">
        <span className="card-title activator grey-text text-darken-4">
          Card Title<i className="material-icons right">more_vert</i>
        </span>
        <p>category: {category}</p>
        <Link to={`/products/${_id}`}>
          <h3>{name}</h3>
        </Link>
      </div>
      <div className="card-reveal">
        <span className="card-title grey-text text-darken-4">
          Card Title<i className="material-icons right">close</i>
        </span>
        <p>
          Here is some more information about this product that is only revealed
          once clicked on.
        </p>
      </div>
    </div>
  </ProductItem>
);
