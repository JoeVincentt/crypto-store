import React from "react";
import { Query } from "react-apollo";
import {
  GET_SELLER_PRODUCTS_ORDERS,
  GET_USER_PRODUCTS
} from "../../queries/index";
import Spinner from "../Spinner";
import { withRouter } from "react-router-dom";

const SellerOrders = ({ session }) => {
  const { username } = session.getCurrentUser;

  return (
    <div className="container center">
      <Query query={GET_USER_PRODUCTS} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          return (
            <div className="container center">
              <div className="row">
                <table className="responsive-table highlight centered">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Item Qty</th>
                      <th>Item Price</th>
                      <th>Order Status</th>
                      <th>Ordered</th>
                    </tr>
                  </thead>
                  {data.getUserProducts.map(product => (
                    <Filter product={product} key={Math.random()} />
                  ))}
                </table>
              </div>{" "}
            </div>
          );
        }}
      </Query>
    </div>
  );
};

export default withRouter(SellerOrders);

const Filter = ({ product }) => (
  <Query query={GET_SELLER_PRODUCTS_ORDERS} variables={{ prodId: product._id }}>
    {({ data: { getSellerProductsOrders }, loading, error }) => {
      console.log(getSellerProductsOrders);
      if (loading) return null;
      if (error) return null;
      return (
        <>
          {getSellerProductsOrders.length <= 0 ? null : (
            <>
              {getSellerProductsOrders.map(order => (
                <tbody key={Math.random()}>
                  <tr>
                    <td>
                      {order.product.length > 0
                        ? order.product[0].name
                        : "PRODUCT WAS REMOVED"}
                    </td>
                    <td>{order.quantity}</td>
                    <td>
                      ${" "}
                      {order.product.length > 0 ? order.product[0].price : "-"}
                    </td>
                    <td>{order.status}</td>
                    <td>{order.user[0].username}</td>
                  </tr>
                </tbody>
              ))}
            </>
          )}
        </>
      );
    }}
  </Query>
);
