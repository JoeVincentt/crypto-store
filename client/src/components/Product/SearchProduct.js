import React from "react";
import { Link } from "react-router-dom";

const SearchItem = ({ _id, name, likes }) => {
  return (
    <div className="col s12 m7">
      <h2 className="header">{name}</h2>
      <div className="card horizontal">
        <div className="card-image">
          <img src="https://lorempixel.com/100/190/nature/6" alt="productpic" />
        </div>
        <div className="card-stacked">
          <div className="card-content">
            <Link to={`/products/${_id}`}>
              <h4>{name}</h4>
            </Link>
            <p>
              I am a very simple card. I am good at containing small bits of
              information.
            </p>
          </div>
          <div className="card-action">
            <p>Likes: {likes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
