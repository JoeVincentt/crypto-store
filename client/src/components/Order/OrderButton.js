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
      window.Materialize.toast("Added to Cart!", 5000, "blue rounded");
    });
  };

  render() {
    const userId = this.props.session.getCurrentUser._id;
    const { prodId } = this.props;
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
              <div className="row center-align">
                <div className="col s4 offset-s4">
                  <label htmlFor="quantity">Quantity</label>
                  <Input
                    type="select"
                    name="quantity"
                    defaultValue="1"
                    onChange={this.handleChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                  </Input>
                  {loading ? (
                    <button
                      className="btn disabled"
                      name="order"
                      onClick={e => this.handleOrder(e, createOrder)}
                    >
                      Ordering
                    </button>
                  ) : (
                    <button
                      className="btn"
                      name="order"
                      onClick={e => this.handleOrder(e, createOrder)}
                    >
                      Order
                    </button>
                  )}
                </div>
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
