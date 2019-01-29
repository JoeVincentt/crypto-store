import React from "react";
import Spinner from "../Spinner";
import { Query } from "react-apollo";
import {
  GET_USER,
  GET_PRODUCT,
  DELETE_ORDER,
  GET_CURRENT_USER,
  UPDATE_ORDER_QUANTITY
} from "../../queries/index";
import DeleteCartItem from "./DeleteCartItem";
import UpdateCartItemQuantity from "./UpdateCartItemQuantity";

const handleDelete = deleteOrder => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );
  if (confirmDelete) {
    deleteOrder().then(({ data }) => {
      console.log(data);
    });
  }
};

const Cart = ({ session }) => {
  const cart = session.getCurrentUser.cart;
  console.log(cart);
  // console.log(session.getCurrentUser);
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
            // console.log(data);
            const name = data.getProduct.name;
            return (
              <Query query={GET_USER} variables={{ userId: item.user[0]._id }}>
                {({ data, loading, error }) => {
                  if (loading) return <Spinner />;
                  if (error) return <div>Error</div>;
                  // console.log(data);
                  const username = data.getUser.username;
                  return (
                    <div>
                      <ul>
                        <li>
                          Product name: {name} || qty: {item.quantity} ||
                          seller: {username}
                        </li>
                      </ul>
                      <UpdateCartItemQuantity
                        quantity={item.quantity}
                        orderId={item._id}
                        UPDATE_ORDER_QUANTITY={UPDATE_ORDER_QUANTITY}
                        GET_CURRENT_USER={GET_CURRENT_USER}
                      />
                      <DeleteCartItem
                        DELETE_ORDER={DELETE_ORDER}
                        GET_CURRENT_USER={GET_CURRENT_USER}
                        handleDelete={handleDelete}
                        userId={item.user[0]._id}
                        orderId={item._id}
                      />
                    </div>
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
