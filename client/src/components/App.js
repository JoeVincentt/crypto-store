import React, { Component } from "react";
// import { Query } from "react-apollo";
import {
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_PRICE
} from "../queries/index";
import ProductItem from "./Product/ProductItem";
import posed from "react-pose";
import PriceSort from "./ProductSort/PriceSort";
import CategorySort from "./ProductSort/CategorySort";

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
    minPrice: 0,
    maxPrice: 999999,
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
    const { category, minPrice, maxPrice, priceRange, on } = this.state;
    return (
      <div className="container center-align">
        <h2>
          Find Product You <strong>Love</strong>
        </h2>
        <PriceSort
          GET_PRODUCTS_BY_PRICE={GET_PRODUCTS_BY_PRICE}
          ProductItem={ProductItem}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          on={on}
          showPriceRange={this.showPriceRange}
          priceChange={this.priceChange}
          ProductList={ProductList}
        />
        <CategorySort
          GET_ALL_PRODUCTS={GET_ALL_PRODUCTS}
          GET_PRODUCTS_BY_CATEGORY={GET_PRODUCTS_BY_CATEGORY}
          category={category}
          on={on}
          categoryChange={this.categoryChange}
          ProductList={ProductList}
          ProductItem={ProductItem}
        />
      </div>
    );
  }
}

export default App;
