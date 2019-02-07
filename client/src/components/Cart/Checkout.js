import React from "react";
import { Mutation } from "react-apollo";

const Checkout = ({
  WHOLE_CART_CHECKOUT,
  GET_CURRENT_USER,
  handleCheckout,
  userId
}) => (
  <Mutation
    mutation={WHOLE_CART_CHECKOUT}
    variables={{
      userId: userId
    }}
    refetchQueries={() => [
      {
        query: GET_CURRENT_USER
      }
    ]}
  >
    {(wholeCartCheckout, attrs = {}) => {
      return (
        <p
          onClick={() => handleCheckout(wholeCartCheckout)}
          className={
            attrs.loading
              ? "btn btn-large disabled"
              : "btn btn-large waves-effect waves-light"
          }
        >
          {attrs.loading ? "Processing..." : "Ceckout"}
        </p>
      );
    }}
  </Mutation>
);

export default Checkout;
