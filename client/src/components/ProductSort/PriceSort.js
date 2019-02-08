import React from "react";
import { Query } from "react-apollo";
import Spinner from "../Spinner";

const PriceSort = ({
  GET_PRODUCTS_BY_PRICE,
  ProductItem,
  ProductList,
  minPrice,
  maxPrice,
  priceRange,
  priceChange,
  showPriceRange,
  on
}) => {
  return (
    <>
      <h3>By Price range:</h3>
      <div className="container center">
        <div className="row">
          <div className="col s2 offset-s2">
            <label htmlFor="minPrice">Min</label>
            <input
              type="number"
              name="minPrice"
              value={minPrice}
              onChange={priceChange}
            />
          </div>
          <div className="col s2">
            <label htmlFor="maxPrice">Max</label>
            <input
              type="number"
              name="maxPrice"
              value={maxPrice}
              onChange={priceChange}
            />
          </div>
          <div className="col s6">
            <button
              className={
                minPrice === 0 && maxPrice === 0
                  ? "btn btn-large disabled"
                  : "btn btn-large"
              }
              onClick={showPriceRange}
            >
              Show results
            </button>
          </div>
        </div>
      </div>
      {priceRange ? (
        <Query
          query={GET_PRODUCTS_BY_PRICE}
          variables={{ minPrice: minPrice, maxPrice: maxPrice }}
        >
          {({ data, loading, error }) => {
            if (loading) return <Spinner />;
            if (error) return <div>Error</div>;

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
      )}{" "}
    </>
  );
};

export default PriceSort;
