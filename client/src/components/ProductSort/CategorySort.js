import React from "react";
import { Query } from "react-apollo";
import Spinner from "../Spinner";

const CategorySort = ({
  categoryChange,
  GET_ALL_PRODUCTS,
  GET_PRODUCTS_BY_CATEGORY,
  on,
  category,
  ProductList,
  ProductItem
}) => {
  return (
    <>
      <h3>By Category:</h3>
      <button className="btn" onClick={() => categoryChange("ALLPRODUCTS")}>
        All Products
      </button>
      <button className="btn" onClick={() => categoryChange("Home")}>
        Home
      </button>
      <button className="btn" onClick={() => categoryChange("Groceris")}>
        Groceris
      </button>
      <button className="btn" onClick={() => categoryChange("Pets")}>
        Pets
      </button>
      <div className="row">
        <div className="col s12">
          <Query query={GET_PRODUCTS_BY_CATEGORY} variables={{ category }}>
            {({ data, loading, error }) => {
              if (loading) return <Spinner />;
              if (error) return <div>Error</div>;

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
    </>
  );
};

export default CategorySort;
