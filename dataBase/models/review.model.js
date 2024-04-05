import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema(
  {
    productId: { type: Types.ObjectId, ref: "Product", required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    orderId: { type: Types.ObjectId, ref: "Order", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 4 },
  },
  {
    timestamps: true,
  }
);

export const Review = model("Review", reviewSchema);
