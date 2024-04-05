import { Timestamp } from "mongodb";
import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true },
  },
  { Timestamp: true }
);

export const Cart = model("Cart", cartSchema);
