import React from "react";
import Spinner from "../Spinner";
import { Query } from "react-apollo";
import { GET_USER, GET_PRODUCT } from "../../queries/index";

const Cart = ({ session }) => {
  const cart = session.getCurrentUser.cart;
  // console.log(cart);
  // console.log("Product ID:", cart[0].product[0]._id);
  // console.log("Quantity:", cart[0].quantity);
  // console.log("User ID:", cart[0].user[0]._id);
  // const prodId = cart[0].product[0]._id;
  // const userId = cart[0].user[0]._id;
  // const quantity = cart[0].quantity;
  return (
    <div className="cantainer center-align">
      <h1>Cart Items</h1>
      {cart.map((item, index) => (
        <Query
          key={index}
          query={GET_PRODUCT}
          variables={{ prodId: item.product[0]._id }}
        >
          {({ data, loading, error }) => {
            if (loading) return <Spinner />;
            if (error) return <div>Error</div>;
            console.log(data);
            const name = data.getProduct.name;
            return (
              <Query query={GET_USER} variables={{ userId: item.user[0]._id }}>
                {({ data, loading, error }) => {
                  if (loading) return <Spinner />;
                  if (error) return <div>Error</div>;
                  console.log(data);
                  const username = data.getUser.username;
                  return (
                    <ul>
                      <li>
                        Product name: {name} || qty: {item.quantity} || seller:{" "}
                        {username}
                      </li>
                    </ul>
                  );
                }}
              </Query>
            );
          }}
        </Query>
      ))}
    </div>
  );
};

export default Cart;
