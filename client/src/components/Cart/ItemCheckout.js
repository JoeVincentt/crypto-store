import React, { Component } from "react";
// import Spinner from "../Spinner";
// import { Query } from "react-apollo";
// import {
//   GET_USER,
//   GET_PRODUCT,
//   DELETE_ORDER,
//   GET_CURRENT_USER,
//   UPDATE_ORDER_QUANTITY
// } from "../../queries/index";

class ItemCheckout extends Component {
  render() {
    return (
      <button className="btn-floating halfway-fab btn-large right waves-effect waves-light blue">
        <i className="large material-icons">check</i>
      </button>
    );
  }
}
export default ItemCheckout;
