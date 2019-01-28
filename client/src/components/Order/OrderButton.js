import React, { Component } from "react";
import { Input } from "react-materialize";
import { Mutation } from "react-apollo";
import Error from "../Error";
import { CREATE_ORDER, GET_CURRENT_USER } from "../../queries/index";

const initialState = {
  quantity: 1
};

class OrderButton extends Component {
  state = { ...initialState };

  handleChange = e => {
    this.setState({ quantity: +e.target.value });
  };

  handleOrder = (e, createOrder) => {
    e.preventDefault();
    createOrder().then(({ data }) => {
      this.setState({ initialState });
      console.log(data);
    });
  };

  render() {
    const { userId, prodId } = this.props;
    const { quantity } = this.state;
    return (
      <Mutation
        mutation={CREATE_ORDER}
        variables={{
          prodId,
          userId,
          quantity
        }}
        refetchQueries={() => [{ query: GET_CURRENT_USER }]}
      >
        {(createOrder, { data, loading, error }) => {
          return (
            <div>
              {" "}
              <div className="row">
                <div className="col s2 offset-s5">
                  <Input
                    type="select"
                    label="Quantity"
                    defaultValue="1"
                    onChange={this.handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Input>
                </div>
              </div>
              <div className="row">
                <button
                  className="btn"
                  name="order"
                  onClick={e => this.handleOrder(e, createOrder)}
                >
                  Order Now
                </button>{" "}
              </div>
              {error && <Error error={error} />}
            </div>
          );
        }}
      </Mutation>
    );
  }
}
export default OrderButton;
