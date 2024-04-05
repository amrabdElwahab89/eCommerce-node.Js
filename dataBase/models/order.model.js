import { Schema, Types, model } from "mongoose";

const modelSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: String, required: true },
        name: { type: String, required: true },
        itemPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    address: { type: String, required: true },
    payment: {
      type: String,
      required: true,
      default: "cash",
      enum: ["cash", "visa"],
    },
    phone: { type: String, required: true },
    price: { type: String, required: true },
    invoice: {
      url: { type: String },
      id: { type: String },
    },
    code: {
      id: { type: Types.ObjectId, required: true },
      name: { type: String },
      discount: { type: Number },
    },
    status: {
      type: String,
      enum: ["placed", "shipped", "delivered", "canceled", "refunded"],
      default: "placed",
    },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

modelSchema.virtual("finalPrice").get(function () {
  return this.code
    ? Number.parseFloat(
        this.price - (this.price * this.code.discount || 0) / 100
      ).toFixed(2)
    : this.price;
});

export const Order = model("Order", modelSchema);
