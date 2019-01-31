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

export default ({
  _id,
  imageUrl,
  name,
  category,
  price,
  description,
  likes
}) => (
  <ProductItem>
    <div className="col m4 l4">
      <div className="card z-depth-5">
        <div className="card-image waves-effect waves-block waves-light">
          <img className="activator" src={`${imageUrl}`} alt="productpic" />
        </div>
        <div className="card-content">
          <Link to={`/products/${_id}`} style={{ fontSize: "20px" }}>
            {name}
          </Link>
          <br />
          <p>
            {" "}
            Category: <strong>{category}</strong>{" "}
          </p>
          <p>
            Price: <strong>$ {price}</strong>{" "}
          </p>
          <br />
          <p>
            {likes}{" "}
            <span role="img" aria-label="heart">
              ❤️
            </span>
          </p>
          <span
            className="card-title activator grey-text text-darken-4"
            style={{ overflow: "visible" }}
          >
            <i className="material-icons right" style={{ marginLeft: "-20px" }}>
              more_vert
            </i>
          </span>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">
            <i className="material-icons right">close</i>
          </span>
          {description}
        </div>
      </div>
    </div>
  </ProductItem>
);
