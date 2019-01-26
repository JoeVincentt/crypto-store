import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import {
  GET_USER_PRODUCTS,
  DELETE_USER_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_CURRENT_USER,
  UPDATE_USER_PRODUCT
} from "../../queries/index";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

class UserProducts extends Component {
  state = {
    _id: "",
    name: "",
    imageUrl: "",
    category: "Other",
    description: "",
    price: 0,
    modal: false
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleDelete = deleteUserProduct => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmDelete) {
      deleteUserProduct().then(({ data }) => {
        console.log(data);
      });
    }
  };

  handleSubmit = (event, updateUserProduct) => {
    event.preventDefault();
    updateUserProduct().then(({ data }) => {
      console.log(data);
      this.closeModal();
    });
  };

  loadProduct = product => {
    this.setState({ ...product, modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { username } = this.props;
    const { modal } = this.state;
    return (
      <Query query={GET_USER_PRODUCTS} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          // console.log(data);
          return (
            <ul>
              {modal && (
                <EditProductModal
                  handleSubmit={this.handleSubmit}
                  product={this.state}
                  closeModal={this.closeModal}
                  handleChange={this.handleChange}
                />
              )}
              <h3>Your Products</h3>
              {!data.getUserProducts.length && (
                <p>
                  <strong>You have no products yet. Add some!</strong>
                </p>
              )}
              {data.getUserProducts.map(product => (
                <li key={product._id}>
                  <Link to={`/products/${product._id}`}>
                    {" "}
                    <p>{product.name}</p>
                  </Link>
                  <p style={{ marginBottom: "0" }}>{product.likes}</p>

                  <Mutation
                    mutation={DELETE_USER_PRODUCT}
                    variables={{ _id: product._id }}
                    refetchQueries={() => [
                      { query: GET_ALL_PRODUCTS },
                      { query: GET_CURRENT_USER }
                    ]}
                    update={(cache, { data: { deleteUserProduct } }) => {
                      const { getUserProducts } = cache.readQuery({
                        query: GET_USER_PRODUCTS,
                        variables: { username }
                      });

                      cache.writeQuery({
                        query: GET_USER_PRODUCTS,
                        variables: { username },
                        data: {
                          getUserProducts: getUserProducts.filter(
                            product => product._id !== deleteUserProduct._id
                          )
                        }
                      });
                    }}
                  >
                    {(deleteUserProduct, attrs = {}) => {
                      return (
                        <div>
                          <button
                            className="button-primary"
                            onClick={() => this.loadProduct(product)}
                          >
                            Update
                          </button>
                          <p
                            onClick={() => this.handleDelete(deleteUserProduct)}
                            className="delete-button"
                          >
                            {attrs.loading ? "deleting..." : "X"}
                          </p>
                        </div>
                      );
                    }}
                  </Mutation>
                </li>
              ))}{" "}
            </ul>
          );
        }}
      </Query>
    );
  }
}

const EditProductModal = ({
  handleSubmit,
  product,
  handleChange,
  closeModal
}) => (
  <Mutation
    mutation={UPDATE_USER_PRODUCT}
    variables={{
      _id: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      description: product.description
    }}
  >
    {updateUserProduct => (
      <div className="modal modal-open">
        <div className="modal-inner">
          <div className="modal-content">
            <form
              onSubmit={event => handleSubmit(event, updateUserProduct)}
              className="modal-content-inner"
            >
              <h4>Edit Product</h4>
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                value={product.name}
              />

              <label htmlFor="imageUrl">Product Image</label>
              <input
                type="text"
                name="imageUrl"
                onChange={handleChange}
                value={product.imageUrl}
              />

              <label htmlFor="category">Category of Product</label>
              <select
                name="category"
                onChange={handleChange}
                value={product.category}
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
                onChange={handleChange}
                value={product.description}
              />
              <label htmlFor="price">Product Price</label>
              <input
                type="number"
                name="price"
                onChange={handleChange}
                value={product.price}
              />

              <hr />
              <div className="modal-buttons">
                <button type="submit" className="button-primary">
                  Update
                </button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </Mutation>
);

export default UserProducts;
