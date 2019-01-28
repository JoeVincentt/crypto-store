import React, { Component } from "react";
import { Mutation } from "react-apollo";
import {
  ADD_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_USER_PRODUCTS
} from "../../queries/index";
// import CKEditor from "react-ckeditor-component";
import Error from "../Error";
import { withRouter } from "react-router-dom";
import withAuth from "../withAuth";
import { Input, Row } from "react-materialize";

const initialState = {
  name: "",
  imageUrl: "",
  category: "Home",
  description: "",
  instructions: "",
  username: "",
  price: ""
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
  priceChangeHandler = event => {
    this.setState({ price: +event.target.value });
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
    const { name, imageUrl, category, description } = this.state;
    const isInvalid = !name || !category || !description || !imageUrl;
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
            <div className="container center-align">
              <h2 className=""> Add Product</h2>
              <div className="row">
                <form
                  className="col s12"
                  onSubmit={event => this.handleSubmit(event, addProduct)}
                >
                  <div className="row">
                    <div className="input-field col s6 offset-s3 center-align">
                      <label htmlFor="name">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        className="validate"
                        onChange={this.handleChange}
                        value={name}
                      />
                    </div>{" "}
                  </div>
                  <div className="row">
                    <div className="input-field col s6 offset-s3 center-align">
                      <label htmlFor="imageUrl">Product Image</label>
                      <input
                        type="text"
                        name="imageUrl"
                        className="validate"
                        onChange={this.handleChange}
                        value={imageUrl}
                      />
                    </div>{" "}
                  </div>
                  <div className="row">
                    <div className="input-field col s6 offset-s3">
                      <label htmlFor="description">Product Description</label>
                      <input
                        type="text"
                        name="description"
                        className="validate"
                        onChange={this.handleChange}
                        value={description}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s6 offset-s3">
                      <label htmlFor="price">Product Price</label>
                      <input
                        type="number"
                        name="price"
                        className="validate"
                        onChange={this.priceChangeHandler}
                        value={price}
                      />
                    </div>
                  </div>
                  <Row>
                    <div className="input-field col s6 offset-s3">
                      <Input
                        s={12}
                        type="select"
                        label="Category"
                        name="category"
                        defaultValue="1"
                        onChange={this.handleChange}
                      >
                        <option value="1">Home</option>
                        <option value="2">Groceries</option>
                        <option value="3">Pets</option>
                      </Input>
                    </div>
                  </Row>

                  <button
                    type="submit"
                    className="btn"
                    disabled={loading || this.validateForm()}
                  >
                    Submit
                  </button>
                  {error && <Error error={error} />}
                </form>
              </div>
              {/* <label htmlFor="instructions">Add instructions</label>
                <CKEditor
                  name="instructions"
                  content={instructions}
                  events={{ change: this.handleEditorChange }}
                /> */}
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
