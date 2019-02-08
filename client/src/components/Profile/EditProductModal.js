import React from "react";
import { Mutation } from "react-apollo";
import { Input } from "react-materialize";

const EditProductModal = ({
  handleSubmit,
  product,
  handleChange,
  UPDATE_USER_PRODUCT
}) => (
  <Mutation
    mutation={UPDATE_USER_PRODUCT}
    variables={{
      _id: product._id,
      name: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      description: product.description,
      price: product.price
    }}
  >
    {updateUserProduct => {
      return (
        <form onSubmit={event => handleSubmit(event, updateUserProduct)}>
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

          <Input
            type="select"
            label="Category of Product"
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            <option value="Other">Other</option>
            <option value="Groceries">Groceries</option>
            <option value="Home">Home</option>
            <option value="Pets">Pets</option>
          </Input>

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
          <div className="modal-footer">
            <button type="submit" className="btn modal-close">
              Update
            </button>
          </div>
        </form>
      );
    }}
  </Mutation>
);

export default EditProductModal;
