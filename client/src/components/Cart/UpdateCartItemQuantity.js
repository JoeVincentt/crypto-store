import React, { Component } from "react";
import { Input } from "react-materialize";
import { Mutation } from "react-apollo";

class UpdateCartItemQuantity extends Component {
  state = {
    itemQuantity: 0
  };

  componentDidMount() {
    this.setState({ itemQuantity: this.props.quantity });
  }

  handleUpdateQuantity = (e, updateOrderQuantity) => {
    this.setState({ itemQuantity: +e.target.value });
    updateOrderQuantity().then(({ data }) => {
      console.log(data);
    });
  };

  render() {
    const { orderId, UPDATE_ORDER_QUANTITY, GET_CURRENT_USER } = this.props;
    const { itemQuantity } = this.state;
    return (
      <Mutation
        mutation={UPDATE_ORDER_QUANTITY}
        variables={{
          orderId: orderId,
          quantity: itemQuantity
        }}
        refetchQueries={() => [
          {
            query: GET_CURRENT_USER
          }
        ]}
      >
        {(updateOrderQuantity, attrs = {}) => {
          return (
            <div className="row">
              <div className="col s4 offset-s4">
                <label htmlFor="quantity">Quantity</label>
                <Input
                  type="select"
                  name="quantity"
                  value={itemQuantity.toString()}
                  onChange={e =>
                    this.handleUpdateQuantity(e, updateOrderQuantity)
                  }
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
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default UpdateCartItemQuantity;
