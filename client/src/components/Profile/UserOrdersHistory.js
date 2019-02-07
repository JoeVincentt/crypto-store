import React from "react";
import { Query } from "react-apollo";
import { GET_USER_ORDERS } from "../../queries/index";
import Spinner from "../Spinner";

const UserOrdersHistory = ({ userId }) => {
  return (
    <Query query={GET_USER_ORDERS} variables={{ userId }}>
      {({ data: { getUserOrders }, loading, error }) => {
        if (loading) return <Spinner />;
        if (error) return <div>Error</div>;
        console.log(getUserOrders);
        return (
          <>
            {" "}
            {getUserOrders.length <= 0 ? (
              "Orders empty"
            ) : (
              <table className="responsive-table highlight centered">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Item Qty</th>
                    <th>Item Price</th>
                    <th>Order Status</th>
                  </tr>
                </thead>

                <tbody>
                  {getUserOrders.map(order => (
                    <tr key={order._id}>
                      <td>
                        {order.product.length > 0
                          ? order.product[0].name
                          : "PRODUCT WAS REMOVED"}
                      </td>
                      <td>{order.quantity}</td>
                      <td>
                        $
                        {order.product.length > 0
                          ? order.product[0].price
                          : "-"}
                      </td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        );
      }}
    </Query>
  );
};

export default UserOrdersHistory;
