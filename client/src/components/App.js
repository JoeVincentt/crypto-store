import React, { Component } from "react";

import { Query } from "react-apollo";
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_PRICE
} from "../queries/index";
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
    on: false,
    category: "Home",
    minPrice: "",
    maxPrice: "",
    priceRange: false
  };

  componentDidMount() {
    setTimeout(this.slideIn, 200);
  }

  slideIn = () => {
    this.setState({ on: !this.state.on });
  };

  categoryChange = category => {
    this.setState({ category });
  };

  priceChange = e => {
    this.setState({ [e.target.name]: +e.target.value });
  };

  showPriceRange = () => {
    this.setState(prevState => ({ priceRange: !prevState.priceRange }));
  };

  render() {
    const { category, minPrice, maxPrice, priceRange } = this.state;
    return (
      <div className="container center-align">
        <h2>
          Find Product You <strong>Love</strong>
        </h2>
        <h3>By Price range:</h3>
        <label htmlFor="minPrice">Min</label>
        <input
          type="number"
          name="minPrice"
          value={this.state.minPrice}
          onChange={this.priceChange}
        />
        <label htmlFor="maxPrice">Max</label>
        <input
          type="number"
          name="maxPrice"
          value={this.state.maxPrice}
          onChange={this.priceChange}
        />
        <button className="btn" onClick={this.showPriceRange}>
          Show results
        </button>
        {priceRange ? (
          <Query
            query={GET_PRODUCTS_BY_PRICE}
            variables={{ minPrice: minPrice, maxPrice: maxPrice }}
          >
            {({ data, loading, error }) => {
              if (loading) return <Spinner />;
              if (error) return <div>Error</div>;

              const { on } = this.state;
              return (
                <ProductList pose={on ? "shown" : "hidden"} className="row">
                  {data.getProductsByPrice.map(product => (
                    <ProductItem {...product} key={product._id} />
                  ))}
                </ProductList>
              );
            }}
          </Query>
        ) : (
          ""
        )}

        <h3>By Category:</h3>
        <button
          className="btn"
          onClick={() => this.categoryChange("ALLPRODUCTS")}
        >
          All Products
        </button>
        <button className="btn" onClick={() => this.categoryChange("Home")}>
          Home
        </button>
        <button className="btn" onClick={() => this.categoryChange("Groceris")}>
          Groceris
        </button>
        <button className="btn" onClick={() => this.categoryChange("Pets")}>
          Pets
        </button>
        <div className="row">
          <div className="col s12">
            <Query query={GET_PRODUCTS_BY_CATEGORY} variables={{ category }}>
              {({ data, loading, error }) => {
                if (loading) return <Spinner />;
                if (error) return <div>Error</div>;

                const { on } = this.state;
                return (
                  <ProductList pose={on ? "shown" : "hidden"} className="row">
                    {data.getProductsByCategory.map(product => (
                      <ProductItem {...product} key={product._id} />
                    ))}
                  </ProductList>
                );
              }}
            </Query>
          </div>
          {category === "ALLPRODUCTS" ? (
            <Query query={GET_ALL_PRODUCTS}>
              {({ data, loading, error }) => {
                if (loading) return <Spinner />;
                if (error) return <div>Error</div>;

                const { on } = this.state;
                return (
                  <ProductList pose={on ? "shown" : "hidden"} className="row">
                    {data.getAllProducts.map(product => (
                      <ProductItem {...product} key={product._id} />
                    ))}
                  </ProductList>
                );
              }}
            </Query>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default App;
