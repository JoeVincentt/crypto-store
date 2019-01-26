import React, { Component } from "react";

import { Query } from "react-apollo";
import { GET_ALL_PRODUCTS } from "../queries/index";
import ProductItem from "./Product/ProductItem";
import posed from "react-pose";
import Spinner from "./Spinner";

const ProductList = posed.ul({
  shown: {
    x: "0%",
    staggerChildren: 100
  },
  hidden: {
    x: "-100%"
  }
});

class App extends Component {
  state = {
    on: false
  };

  componentDidMount() {
    setTimeout(this.slideIn, 200);
  }

  slideIn = () => {
    this.setState({ on: !this.state.on });
  };

  render() {
    return (
      <div className="App">
        <h1 className="main-title">
          Find Product You <strong>Love</strong>
        </h1>
        <Query query={GET_ALL_PRODUCTS}>
          {({ data, loading, error }) => {
            if (loading) return <Spinner />;
            if (error) return <div>Error</div>;

            const { on } = this.state;
            return (
              <ProductList pose={on ? "shown" : "hidden"} className="cards">
                {data.getAllProducts.map(product => (
                  <ProductItem {...product} key={product._id} />
                ))}
              </ProductList>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default App;
