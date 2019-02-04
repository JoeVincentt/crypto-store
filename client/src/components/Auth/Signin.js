import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { SIGNIN_USER } from "../../queries/index";
import Error from "../Error";
import { withRouter } from "react-router-dom";
const initialState = {
  email: "",
  password: ""
};

class Signin extends Component {
  state = { ...initialState };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleSubmit = (event, signinUser) => {
    event.preventDefault();
    signinUser().then(async ({ data }) => {
      console.log(data);
      localStorage.setItem("token", data.signinUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.goBack();
    });
  };

  validateForm = () => {
    const { email, password } = this.state;
    const isInvalid = !email || !password;
    return isInvalid;
  };

  render() {
    const { email, password } = this.state;
    return (
      <div className="container center-align">
        <h2 className="center">Signin</h2>
        <Mutation mutation={SIGNIN_USER} variables={{ email, password }}>
          {(signinUser, { data, loading, error }) => {
            return (
              <div className="row">
                <form
                  className="col s12"
                  onSubmit={event => this.handleSubmit(event, signinUser)}
                >
                  <div className="row">
                    <div className="input-field col s6 offset-s3 center-align">
                      <input
                        id="email"
                        type="email"
                        className="validate"
                        name="email"
                        onChange={this.handleChange}
                        value={email}
                      />
                      <label htmlFor="email">Email</label>
                    </div>{" "}
                  </div>
                  <div className="row">
                    <div className="input-field col s6 offset-s3">
                      <input
                        id="password"
                        type="password"
                        name="password"
                        className="validate"
                        onChange={this.handleChange}
                        value={password}
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn"
                    disabled={loading || this.validateForm()}
                  >
                    Submit
                  </button>
                  {error && <Error error={error} />}
                </form>
              </div>
            );
          }}
        </Mutation>
      </div>
    );
  }
}
export default withRouter(Signin);
