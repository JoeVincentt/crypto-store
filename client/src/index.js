import React, { Fragment, Component } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import "./index.css";
import "./App.css";
import * as serviceWorker from "./serviceWorker";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import App from "./components/App";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import withSession from "./components/withSession";
import Navbar from "./components/Navbar";
import Search from "./components/Product/Search";
import AddProduct from "./components/Product/AddProduct";
import ProductPage from "./components/Product/ProductPage";
import Profile from "./components/Profile/Profile";
import Cart from "./components/Cart/Cart";
import Wallet from "./components/Wallet/Wallet";
import SellerOrders from "./components/Profile/SellerOrders";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token
      }
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      // console.log("Network Error", networkError);
      // if(networkError.statusCode === 401){
      //   localStorage.removeItem('token')
      // }
    }
  }
});

class Root extends Component {
  render() {
    const { refetch, session } = this.props;
    return (
      <Router>
        <Fragment>
          <Navbar session={session} />
          <Switch>
            <Route exact path="/" component={App} />
            <Route path="/search" component={Search} />
            <Route path="/signin" render={() => <Signin refetch={refetch} />} />
            <Route path="/signup" render={() => <Signup refetch={refetch} />} />
            <Route
              path="/product/add"
              render={() => <AddProduct session={session} />}
            />
            <Route
              path="/products/:_id"
              render={() => <ProductPage session={session} />}
            />

            <Route
              path="/profile"
              exact
              render={() => <Profile session={session} />}
            />

            <Route
              path="/profile/cart"
              exact
              render={() => <Cart session={session} />}
            />
            <Route
              path="/profile/wallet"
              exact
              render={() => <Wallet session={session} />}
            />
            <Route
              path="/profile/orders"
              exact
              render={() => <SellerOrders session={session} />}
            />

            <Redirect to="/" />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
