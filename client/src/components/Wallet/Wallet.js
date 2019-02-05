import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { GET_COINS, GET_CURRENT_USER } from "../../queries/index";
import Error from "../Error";

class Wallet extends Component {
  state = {
    amount: ""
  };

  handleChange = e => {
    this.setState({
      amount: +e.target.value
    });
  };

  handleClick = (e, getCoins) => {
    e.preventDefault();
    getCoins().then(({ data }) => {
      this.setState({ amount: "" });
      window.Materialize.toast("Balance Updated!", 5000, "blue rounded");
    });
  };

  render() {
    const userId = this.props.session.getCurrentUser._id;
    const balance = this.props.session.getCurrentUser.wallet;
    const amount = this.state.amount;
    return (
      <Mutation
        mutation={GET_COINS}
        variables={{
          userId: userId,
          amount: amount
        }}
        refetchQueries={() => [{ query: GET_CURRENT_USER }]}
      >
        {(getCoins, { data, loading, error }) => {
          return (
            <div>
              <div className="container center-align">
                <div className="row">
                  <div className="col s6 offset-s3">
                    <h3>Your curent balance: $ {balance}</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col s6 offset-s3">
                    <h5>Add funds: </h5>
                    <div className="row">
                      <div className="col s4 offset-s4">
                        <input
                          type="number"
                          value={amount}
                          placeholder="Amount"
                          onChange={e => this.handleChange(e)}
                        />
                      </div>
                    </div>

                    <button
                      className={loading ? "btn disabled" : "btn"}
                      onClick={e => this.handleClick(e, getCoins)}
                    >
                      {loading ? "processing..." : "get coins"}
                    </button>
                  </div>
                </div>
                {error && <Error error={error} />}
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default Wallet;
