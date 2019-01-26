const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  username: {
    type: String
  },
  price: {
    type: Number,
    required: true
  }
});

ProductSchema.index({
  "$**": "text"
});

module.exports = mongoose.model("Product", ProductSchema);
