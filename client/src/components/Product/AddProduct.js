import React, { Component } from "react";
import { Mutation } from "react-apollo";
import {
  ADD_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_USER_PRODUCTS
} from "../../queries/index";
import CKEditor from "react-ckeditor-component";
import Error from "../Error";
import { withRouter } from "react-router-dom";
import withAuth from "../withAuth";

const initialState = {
  name: "",
  imageUrl: "",
  category: "Breakfast",
  description: "",
  instructions: "",
  username: ""
};

class AddProduct extends Component {
  state = { ...initialState };

  clearState = () => {
    this.setState({ ...initialState });
  };

  componentDidMount() {
    this.setState({ username: this.props.session.getCurrentUser.username });
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleEditorChange = event => {
    const newContent = event.editor.getData();
    this.setState({ instructions: newContent });
  };

  handleSubmit = (event, addProduct) => {
    event.preventDefault();
    addProduct().then(({ data }) => {
      this.clearState();
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { name, imageUrl, category, description, instructions } = this.state;
    const isInvalid =
      !name || !category || !description || !instructions || !imageUrl;
    return isInvalid;
  };

  updateCache = (cache, { data: { addProduct } }) => {
    const { getAllProducts } = cache.readQuery({ query: GET_ALL_PRODUCTS });
    cache.writeQuery({
      query: GET_ALL_PRODUCTS,
      data: {
        getAllProducts: [addProduct, ...getAllProducts]
      }
    });
  };

  render() {
    const {
      name,
      imageUrl,
      category,
      description,
      price,
      username
    } = this.state;
    return (
      <Mutation
        mutation={ADD_PRODUCT}
        variables={{
          name,
          imageUrl,
          category,
          description,
          price,
          username
        }}
        refetchQueries={() => [
          { query: GET_USER_PRODUCTS, variables: { username } }
        ]}
        update={this.updateCache}
      >
        {(addProduct, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App"> Add Product</h2>
              <form
                className="form"
                onSubmit={event => this.handleSubmit(event, addProduct)}
              >
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Add Name"
                  onChange={this.handleChange}
                  value={name}
                />
                <label htmlFor="imageUrl">Product Image</label>
                <input
                  type="text"
                  name="imageUrl"
                  placeholder="Add Image URL"
                  onChange={this.handleChange}
                  value={imageUrl}
                />
                <label htmlFor="category">Category of Product</label>
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Other">Other</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Home">Home</option>
                  <option value="Pets">Pets</option>
                </select>
                <label htmlFor="description">Product Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Add Description"
                  onChange={this.handleChange}
                  value={description}
                />
                <label htmlFor="price">Product Price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Add Price"
                  onChange={this.handleChange}
                  value={price}
                />
                {/* <label htmlFor="instructions">Add instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  events={{ change: this.handleEditorChange }}
                /> */}

                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withAuth(session => session && session.getCurrentUser)(
  withRouter(AddProduct)
);
