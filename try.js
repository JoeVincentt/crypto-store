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
          placeholder="Add Name"
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
          placeholder="Add Image URL"
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
          placeholder="Add Description"
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
          placeholder="Add Price"
          className="validate"
          onChange={this.handleChange}
          value={price}
        />
      </div>
    </div>
    <div className="row">
      <div className="input-field col s6 offset-s3">
        <select multiple>
          <option value disabled selected>
            Choose your option
          </option>
          <option value={1}>Groceries</option>
          <option value={2}>Home</option>
          <option value={3}>Pets</option>
        </select>
      </div>
    </div>

    <button
      type="submit"
      className="btn"
      disabled={loading || this.validateForm()}
    >
      Submit
    </button>
    {error && <Error error={error} />}
  </form>
</div>;
