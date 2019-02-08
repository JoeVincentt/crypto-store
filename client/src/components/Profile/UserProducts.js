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
import { Modal } from "react-materialize";
import { FaEdit } from "react-icons/fa";
import EditProductModal from "./EditProductModal";

class UserProducts extends Component {
  state = {
    _id: "",
    name: "",
    imageUrl: "",
    category: "Other",
    description: "",
    price: 0
  };

  handleChange = event => {
    if (event.target.name === "price") {
      this.setState({
        price: +event.target.value
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
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
    });
  };

  loadProduct = (e, product) => {
    e.preventDefault();
    this.setState({ ...product });
  };

  render() {
    const { username } = this.props;

    return (
      <Query query={GET_USER_PRODUCTS} variables={{ username }}>
        {({ data, loading, error }) => {
          if (loading) return <Spinner />;
          if (error) return <div>Error</div>;
          // console.log(data);
          return (
            <div className="row">
              {" "}
              <Link to="/profile/orders" className="btn">
                To orders
              </Link>
              {!data.getUserProducts.length && (
                <p>
                  <strong>You have no products yet. Add some!</strong>
                </p>
              )}
              {data.getUserProducts.map(product => (
                <div className="col m6" key={product._id}>
                  <div className="card z-depth-5">
                    <div className="card-image">
                      <img src={`${product.imageUrl}`} alt="prodimg" />
                    </div>
                    <div className="card-content">
                      <Link to={`/products/${product._id}`}>
                        {" "}
                        <h5>{product.name}</h5>
                      </Link>
                      <p>
                        Price: <strong>$ {product.price}</strong>
                      </p>
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
                            <div className="card-action">
                              <div className="row">
                                <div className="col s12">
                                  <div className="col s6">
                                    {" "}
                                    <Modal
                                      header="Update Product"
                                      trigger={
                                        <button className="btn-floating btn-large waves-effect waves-light modal-trigger">
                                          <div
                                            className="center-align"
                                            onClick={e =>
                                              this.loadProduct(e, product)
                                            }
                                            style={{
                                              fontSize: "20px",
                                              marginLeft: "3px",
                                              marginTop: "3px"
                                            }}
                                          >
                                            {" "}
                                            <FaEdit />
                                          </div>
                                        </button>
                                      }
                                    >
                                      <EditProductModal
                                        UPDATE_USER_PRODUCT={
                                          UPDATE_USER_PRODUCT
                                        }
                                        handleSubmit={this.handleSubmit}
                                        product={this.state}
                                        handleChange={this.handleChange}
                                      />
                                    </Modal>
                                  </div>
                                  <div className="col s6">
                                    <button
                                      onClick={() =>
                                        this.handleDelete(deleteUserProduct)
                                      }
                                      className="btn-floating btn-large waves-effect waves-light red"
                                    >
                                      {attrs.loading ? (
                                        <i className="large material-icons">
                                          delete_sweep
                                        </i>
                                      ) : (
                                        <i className="large material-icons">
                                          delete_forever
                                        </i>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      </Mutation>
                    </div>
                  </div>
                </div>
              ))}{" "}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default UserProducts;
