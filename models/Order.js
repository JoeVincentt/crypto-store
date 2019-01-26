const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    product: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "Product"
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    user: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
