import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, Button } from "react-materialize";
import { withRouter } from "react-router-dom";
import { ApolloConsumer } from "react-apollo";
import {
  FaShoppingCart,
  FaUser,
  FaHome,
  FaSearch,
  FaPlusSquare,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaWallet
} from "react-icons/fa";
import { IconContext } from "react-icons";

class MainNavbar extends Component {
  state = {
    activeNav: ""
  };

  changeNavActiveLink = address => {
    this.setState({ activeNav: address });
  };

  handleSignout = (client, history) => {
    localStorage.setItem("token", "");
    this.setState({ activeNav: "home" });
    client.resetStore();
    history.push("/");
  };

  render() {
    const { session, history } = this.props;
    const { activeNav } = this.state;
    return (
      <IconContext.Provider
        value={{
          size: "20px",

          className: "global-class-name"
        }}
      >
        <Navbar
          brand="Crypto Store"
          trigger={<Button>Nav Close</Button>}
          options={{ closeOnClick: true }}
          right
        >
          {session && session.getCurrentUser ? (
            <NavbarAuth
              session={session}
              changeNavActiveLink={this.changeNavActiveLink}
              activeNav={activeNav}
              handleSignout={this.handleSignout}
              history={history}
            />
          ) : (
            <NavbarUnAuth
              changeNavActiveLink={this.changeNavActiveLink}
              activeNav={activeNav}
            />
          )}
        </Navbar>
      </IconContext.Provider>
    );
  }
}

const NavbarAuth = ({
  session,
  activeNav,
  changeNavActiveLink,
  handleSignout,
  history
}) => (
  <ul>
    <li
      onClick={() => changeNavActiveLink("home")}
      className={activeNav === "home" ? "active" : ""}
    >
      <Link to="/">
        <FaHome style={{ marginBottom: "-5px" }} />
        <span className="hide-on-large-only" style={{ marginLeft: "5px" }}>
          Home
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("search")}
      className={activeNav === "search" ? "active" : ""}
    >
      <Link to="/search">
        <FaSearch style={{ marginBottom: "-5px" }} />
        <span className="hide-on-large-only" style={{ marginLeft: "5px" }}>
          Search
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("addproduct")}
      className={activeNav === "addproduct" ? "active" : ""}
    >
      <Link to="/product/add">
        <FaPlusSquare style={{ marginBottom: "-5px" }} />
        <span className="hide-on-large-only" style={{ marginLeft: "5px" }}>
          Add Product
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("cart")}
      className={activeNav === "cart" ? "active" : ""}
    >
      <Link to="/profile/cart">
        <span>
          <FaShoppingCart style={{ marginBottom: "-5px" }} /> (
          {session.getCurrentUser.cart.length})
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("wallet")}
      className={activeNav === "wallet" ? "active" : ""}
    >
      <Link to="/profile/wallet">
        <span>
          <FaWallet style={{ marginBottom: "-5px" }} /> (
          {session.getCurrentUser.wallet})
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("myprofile")}
      className={activeNav === "myprofile" ? "active" : ""}
    >
      <Link to="/profile">
        <FaUser
          style={{
            marginBottom: "-5px",
            marginRight: "5px",
            marginLeft: "-3px"
          }}
        />
        ({session.getCurrentUser.username})
      </Link>
    </li>
    <li>
      <ApolloConsumer>
        {client => {
          return (
            <Link to="/" onClick={() => handleSignout(client, history)}>
              <FaSignOutAlt style={{ marginBottom: "-5px" }} />
              <span
                className="hide-on-large-only"
                style={{ marginLeft: "5px" }}
              >
                Log Out
              </span>
            </Link>
          );
        }}
      </ApolloConsumer>
    </li>
  </ul>
);

const NavbarUnAuth = ({ activeNav, changeNavActiveLink }) => (
  <ul>
    <li
      onClick={() => changeNavActiveLink("home")}
      className={activeNav === "home" ? "active" : ""}
    >
      <Link to="/">
        <FaHome style={{ marginBottom: "-5px" }} />
        <span className="hide-on-large-only" style={{ marginLeft: "5px" }}>
          Home
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("search")}
      className={activeNav === "search" ? "active" : ""}
    >
      <Link to="/search">
        <FaSearch style={{ marginBottom: "-5px" }} />
        <span className="hide-on-large-only" style={{ marginLeft: "5px" }}>
          Search
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("signin")}
      className={activeNav === "signin" ? "active" : ""}
    >
      <Link to="/signin">
        <FaSignInAlt style={{ marginBottom: "-5px" }} />
        <span className="hide-on-large-only" style={{ marginLeft: "5px" }}>
          Sign In
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("signup")}
      className={activeNav === "signup" ? "active" : ""}
    >
      <Link to="/signup">
        <FaUserPlus style={{ marginBottom: "-5px" }} />
        <span className="hide-on-large-only" style={{ marginLeft: "5px" }}>
          Sign Up
        </span>
      </Link>
    </li>
  </ul>
);

export default withRouter(MainNavbar);
