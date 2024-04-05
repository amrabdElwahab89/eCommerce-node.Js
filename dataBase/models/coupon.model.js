import { Schema, Types, model } from "mongoose";

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expireAt: { type: Number, required: true },
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
});

export const Coupon = model("Coupon", couponSchema);
