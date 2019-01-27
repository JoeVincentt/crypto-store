import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { SIGNUP_USER } from "../../queries/index";
import Error from "../Error";
import { withRouter } from "react-router-dom";

const initialState = {
  username: "",
  email: "",
  password: "",
  passwordConfirmation: ""
};

class Signup extends Component {
  state = { ...initialState };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleSubmit = (event, signupUser) => {
    event.preventDefault();
    signupUser().then(async ({ data }) => {
      console.log(data);
      localStorage.setItem("token", data.signupUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { username, password, email, passwordConfirmation } = this.state;
    const isInvalid =
      !username || !password || !email || password !== passwordConfirmation;
    return isInvalid;
  };

  render() {
    const { username, password, email, passwordConfirmation } = this.state;
    return (
      <div className="container center-align">
        <h2 className="">Signup</h2>
        <Mutation
          mutation={SIGNUP_USER}
          variables={{ username, email, password, passwordConfirmation }}
        >
          {(signupUser, { data, loading, error }) => {
            return (
              // <form
              //   className="form"
              //   onSubmit={event => this.handleSubmit(event, signupUser)}
              // >
              //   <input
              //     type="text"
              //     name="username"
              //     placeholder="Username"
              //     onChange={this.handleChange}
              //     value={username}
              //   />
              //   <input
              //     type="email"
              //     name="email"
              //     placeholder="Email"
              //     onChange={this.handleChange}
              //     value={email}
              //   />
              //   <input
              //     type="password"
              //     name="password"
              //     placeholder="Password"
              //     onChange={this.handleChange}
              //     value={password}
              //   />
              //   <input
              //     type="password"
              //     name="passwordConfirmation"
              //     placeholder="Confirm Password"
              //     onChange={this.handleChange}
              //     value={passwordConfirmation}
              //   />
              //   <button
              //     type="submit"
              //     className="btn"
              //     disabled={loading || this.validateForm()}
              //   >
              //     Submit
              //   </button>
              //   {error && <Error error={error} />}
              // </form>
              <div className="row">
                <form
                  className="col s12"
                  onSubmit={event => this.handleSubmit(event, signupUser)}
                >
                  <div className="row">
                    <div className="input-field col s6 offset-s3 center-align">
                      <input
                        id="username"
                        type="text"
                        className="validate"
                        name="username"
                        onChange={this.handleChange}
                        value={username}
                      />
                      <label htmlFor="username">Username</label>
                    </div>{" "}
                  </div>
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
                    <div className="input-field col s6 offset-s3 center-align">
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
                  <div className="row">
                    <div className="input-field col s6 offset-s3 center-align">
                      <input
                        id="passwordConfirmation"
                        type="password"
                        name="passwordConfirmation"
                        className="validate"
                        onChange={this.handleChange}
                        value={passwordConfirmation}
                      />
                      <label htmlFor="passwordConfirmation">
                        Password Confirmation
                      </label>
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
export default withRouter(Signup);
