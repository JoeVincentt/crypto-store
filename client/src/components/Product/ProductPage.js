import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_PRODUCT } from "../../queries/index";
import LikeProduct from "./LikeProduct";
import Spinner from "../Spinner";
import OrderButton from "../Order/OrderButton";

const ProductPage = ({ match, session }) => {
  const prodId = match.params._id;
  const userId = session.getCurrentUser._id;
  return (
    <Query query={GET_PRODUCT} variables={{ prodId }}>
      {({ data, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div>Error</div>;
        console.log(data);
        return (
          <div className="container center-align">
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
              <div className="transparent product-description">
                {data.getProduct.description}
              </div>
              <h3 className="product-instructions__title">Instructions</h3>
              <div
                className="product-instructions"
                dangerouslySetInnerHTML={{
                  __html: data.getProduct.instructions
                }}
              />{" "}
              <LikeProduct _id={prodId} />
            </div>
            <OrderButton prodId={prodId} userId={userId} />
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(ProductPage);
