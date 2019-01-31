import React from "react";
import { Mutation } from "react-apollo";

const DeleteCartItem = ({
  DELETE_ORDER,
  GET_CURRENT_USER,
  handleDelete,
  userId,
  orderId
}) => (
  <Mutation
    mutation={DELETE_ORDER}
    variables={{
      userId: userId,
      orderId: orderId
    }}
    refetchQueries={() => [
      {
        query: GET_CURRENT_USER
      }
    ]}
  >
    {(deleteOrder, attrs = {}) => {
      return (
        <p
          onClick={() => handleDelete(deleteOrder)}
          className="btn-floating left btn-large waves-effect waves-light red halfway-fab"
        >
          {attrs.loading ? (
            <i className="large material-icons">delete_sweep</i>
          ) : (
            <i className="large material-icons">delete_forever</i>
          )}
        </p>
      );
    }}
  </Mutation>
);

export default DeleteCartItem;
