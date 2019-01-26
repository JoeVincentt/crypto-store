import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_PRODUCT } from "../../queries/index";
import LikeProduct from "./LikeProduct";
import Spinner from "../Spinner";

const ProductPage = ({ match }) => {
  const { _id } = match.params;
  return (
    <Query query={GET_PRODUCT} variables={{ _id }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div>Error</div>;
        // console.log(data);
        return (
          <div className="App">
            <div
              style={{
                background: `url(${
                  data.getProduct.imageUrl
                }) center center / cover no-repeat`
              }}
              className="product-image"
            />
            <div className="product">
              <div className="product-header">
                <div className="product-name">
                  <h2 className="product-name">
                    <strong>{data.getProduct.name}</strong>
                  </h2>{" "}
                </div>
                <h5>
                  <strong>{data.getProduct.category}</strong>
                </h5>
                <p>
                  Created by <strong>{data.getProduct.username}</strong>
                </p>
                <p>
                  {data.getProduct.likes}{" "}
                  <span role="img" aria-label="heart">
                    ❤️
                  </span>
                </p>
              </div>
              <blockquote className="product-description">
                {data.getProduct.description}
              </blockquote>
              <h3 className="product-instructions__title">Instructions</h3>
              <div
                className="product-instructions"
                dangerouslySetInnerHTML={{
                  __html: data.getProduct.instructions
                }}
              />{" "}
              <LikeProduct _id={_id} />
            </div>
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(ProductPage);
