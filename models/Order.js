const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    product: {
      type: [Schema.Types.ObjectId],
      required: true,
      autopopulate: true,
      ref: "Product"
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      required: true,
      default: "unpaid"
    },
    user: {
      type: [Schema.Types.ObjectId],
      required: true,
      autopopulate: true,
      ref: "User"
    }
  },
  { timestamps: true }
);

orderSchema.plugin(require("mongoose-autopopulate"));

module.exports = mongoose.model("Order", orderSchema);
