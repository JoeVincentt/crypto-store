import React, { Component } from "react";
import { ApolloConsumer } from "react-apollo";
import { SEARCH_PRODUCT } from "../../queries/index";

import SearchProduct from "./SearchProduct";

class Search extends Component {
  state = {
    searchResults: []
  };

  handleChange = ({ searchProduct }) => {
    this.setState({
      searchResults: searchProduct
    });
  };

  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer>
        {client => (
          <div className="App">
            <input
              type="search"
              className="search"
              placeholder="Search Products..."
              onChange={async event => {
                event.persist();
                const { data } = await client.query({
                  query: SEARCH_PRODUCT,
                  variables: { searchTerm: event.target.value }
                });
                this.handleChange(data);
              }}
            />
            <ul>
              {searchResults.map(product => (
                <SearchProduct key={product._id} {...product} />
              ))}
            </ul>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}
export default Search;
