import React, { Component } from "react";
import Spinner from "../Spinner";

import { Query } from "react-apollo";
import {
  GET_PRODUCT,
  DELETE_ORDER,
  GET_CURRENT_USER,
  UPDATE_ORDER_QUANTITY
} from "../../queries/index";
import DeleteCartItem from "./DeleteCartItem";
import UpdateCartItemQuantity from "./UpdateCartItemQuantity";
import ItemCheckout from "./ItemCheckout";

import { Divider } from "react-materialize";

class Cart extends Component {
  handleDelete = deleteOrder => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (confirmDelete) {
      deleteOrder().then(({ data }) => {
        console.log(data);
      });
    }
  };

  render() {
    return (
      <Query query={GET_CURRENT_USER} pollInterval={2000}>
        {({ data, loading, startPolling, stopPolling, refetch }) => {
          console.log(data);

          if (loading) return null;
          return (
            <div className="container center-align">
              <h1>Cart Items</h1>
              <h5>Total Cart Price: {data.getCurrentUser.cartTotal}</h5>

              {data.getCurrentUser.cart.map((item, index) => (
                <Query
                  key={index}
                  query={GET_PRODUCT}
                  variables={{ prodId: item.product[0]._id }}
                  refetchQueries={() => [
                    {
                      query: GET_CURRENT_USER
                    }
                  ]}
                >
                  {({ data, loading, error }) => {
                    if (loading) return <Spinner />;
                    if (error) return <div>Error</div>;

                    const name = data.getProduct.name;
                    const price = data.getProduct.price;
                    const username = data.getProduct.username;
                    const category = data.getProduct.category;
                    const imageUrl = data.getProduct.imageUrl;
                    const quantity = item.quantity;
                    return (
                      <div className="row">
                        <div className="col">
                          {" "}
                          <div className="card horizontal z-depth-5">
                            <div className="card-image">
                              <img src={`${imageUrl}`} alt="productpic" />
                            </div>
                            <div className="container center-align">
                              <div className="card-content">
                                <h4>{name}</h4>
                                <Divider />
                                <p>
                                  {" "}
                                  Category: <strong>{category}</strong>{" "}
                                </p>
                                <p>
                                  Created by: <strong>{username}</strong>
                                </p>
                                <Divider />
                                <p>
                                  Price per Unit: <strong>$ {price}</strong>{" "}
                                </p>
                                <h5>
                                  Total Price:{" "}
                                  <strong>
                                    $ {(price * quantity).toFixed(2)}
                                  </strong>{" "}
                                </h5>
                                <Divider />
                                <UpdateCartItemQuantity
                                  quantity={item.quantity}
                                  orderId={item._id}
                                  UPDATE_ORDER_QUANTITY={UPDATE_ORDER_QUANTITY}
                                  GET_CURRENT_USER={GET_CURRENT_USER}
                                />
                                <DeleteCartItem
                                  DELETE_ORDER={DELETE_ORDER}
                                  GET_CURRENT_USER={GET_CURRENT_USER}
                                  handleDelete={this.handleDelete}
                                  userId={item.user[0]._id}
                                  orderId={item._id}
                                />{" "}
                                <ItemCheckout />
                              </div>
                            </div>
                          </div>{" "}
                        </div>
                      </div>
                    );
                  }}
                </Query>
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Cart;
