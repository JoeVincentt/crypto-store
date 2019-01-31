import React from "react";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";
import { GET_PRODUCT } from "../../queries/index";
import LikeProduct from "./LikeProduct";
import Spinner from "../Spinner";
import OrderButton from "../Order/OrderButton";
import posed from "react-pose";
import { Divider } from "react-materialize";

const ProductItem = posed.li({
  shown: {
    opacity: 1
  },
  hidden: {
    opacity: 0
  }
});

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
          <ProductItem>
            <div className="row">
              <div className="col m8 offset-m2">
                <div className="card z-depth-5">
                  <div className="card-image waves-effect waves-block waves-light">
                    <img
                      className="activator"
                      src={`${data.getProduct.imageUrl}`}
                      alt="productpic"
                    />
                  </div>
                  <div className="container center-align">
                    <div className="card-content">
                      <h4>{data.getProduct.name}</h4>
                      <p>
                        {data.getProduct.likes} <LikeProduct _id={prodId} />
                      </p>
                      <br />
                      <Divider />
                      <br />
                      <p>
                        {" "}
                        Category: <strong>
                          {data.getProduct.category}
                        </strong>{" "}
                      </p>
                      <h5>Description: </h5>
                      <p>{data.getProduct.description}</p>
                      <br />
                      <p>
                        Created by: <strong>{data.getProduct.username}</strong>
                      </p>

                      <br />
                      <Divider />
                      <br />
                      <h5>
                        Price: <strong>$ {data.getProduct.price}</strong>{" "}
                      </h5>
                      <br />
                      <Divider />
                      <OrderButton prodId={prodId} userId={userId} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProductItem>
        );
      }}
    </Query>
  );
};

export default withRouter(ProductPage);
