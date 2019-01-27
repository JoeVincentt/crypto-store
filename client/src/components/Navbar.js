import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Navbar, Button } from "react-materialize";
import { withRouter } from "react-router-dom";
import { ApolloConsumer } from "react-apollo";
import { FaShoppingCart } from "react-icons/fa";

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
      <Link to="/">Home</Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("search")}
      className={activeNav === "search" ? "active" : ""}
    >
      <Link to="/search">Search</Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("addproduct")}
      className={activeNav === "addproduct" ? "active" : ""}
    >
      <Link to="/product/add">Add Product</Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("cart")}
      className={activeNav === "cart" ? "active" : ""}
    >
      <Link to="/profile/cart">
        <span>
          Cart{" "}
          <FaShoppingCart style={{ fontSize: "20px", marginBottom: "-5px" }} />{" "}
          ({session.getCurrentUser.cart.length})
        </span>
      </Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("myprofile")}
      className={activeNav === "myprofile" ? "active" : ""}
    >
      <Link to="/profile">{session.getCurrentUser.username}</Link>
    </li>
    <li>
      <ApolloConsumer>
        {client => {
          return (
            <Link to="/" onClick={() => handleSignout(client, history)}>
              Sign out
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
      <Link to="/">Home</Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("search")}
      className={activeNav === "search" ? "active" : ""}
    >
      <Link to="/search">Search</Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("signin")}
      className={activeNav === "signin" ? "active" : ""}
    >
      <Link to="/signin">Sign In</Link>
    </li>
    <li
      onClick={() => changeNavActiveLink("signup")}
      className={activeNav === "signup" ? "active" : ""}
    >
      <Link to="/signup">Sign Up</Link>
    </li>
  </ul>
);

export default withRouter(MainNavbar);
