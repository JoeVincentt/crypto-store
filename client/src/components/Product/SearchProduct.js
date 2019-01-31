import React from "react";
import { Link } from "react-router-dom";
import Divider from "react-materialize/lib/Divider";

const SearchItem = ({
  _id,
  name,
  likes,
  imageUrl,
  price,
  description,
  username,
  category
}) => {
  return (
    <div className="col m6 l6">
      <div className="card medium z-depth-5">
        <div className="card-image waves-effect waves-block waves-light">
          <img className="activator" src={`${imageUrl}`} alt="productpic" />
        </div>
        <div className="container center-align">
          <div className="card-content">
            <h4>
              <Link to={`/products/${_id}`}> {name}</Link>
            </h4>
            <p>
              {likes}
              <span role="img" aria-label="heart">
                ❤️
              </span>
            </p>

            <Divider />

            <h5>
              Price: <strong>$ {price}</strong>{" "}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
